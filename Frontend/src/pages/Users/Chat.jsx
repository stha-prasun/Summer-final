import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ArrowLeft, MessageCircle } from "lucide-react";
import UserNavbar from "../../components/UserComponents/UserNavbar";
import Footer from "../../components/Footer";
import api from "../../services/api";
import { connectSocket } from "../../services/socket";

export default function UserChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const convoIdRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/chat/conversation");
        if (cancelled) return;
        const convoId = data.conversation._id;
        convoIdRef.current = convoId;

        const { data: msgData } = await api.get(`/chat/${convoId}/messages`);
        if (cancelled) return;
        setMessages(msgData.messages || []);

        await api.patch(`/chat/${convoId}/read`);

        // Connect socket and join conversation room
        const socket = connectSocket();
        socketRef.current = socket;
        socket.emit("joinConversation", convoId);

        socket.on("connect", () => {
          if (convoIdRef.current) {
            socket.emit("joinConversation", convoIdRef.current);
            api.get(`/chat/${convoIdRef.current}/messages`).then(({ data }) => {
              setMessages(data.messages || []);
            });
          }
        });

        socket.on("message:new", ({ conversationId: cid, message }) => {
          if (cid === convoIdRef.current) {
            setMessages((prev) => [...prev, message]);
          }
        });
      } catch (err) {
        console.error("Chat init error:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    init();

    return () => {
      cancelled = true;
      const socket = socketRef.current;
      if (socket && convoIdRef.current) {
        socket.emit("leaveConversation", convoIdRef.current);
        socket.off("message:new");
        socket.off("connect");
      }
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending || !convoIdRef.current) return;

    setSending(true);
    const text = input.trim();
    setInput("");

    const socket = connectSocket();
    socket.emit("sendMessage", { conversationId: convoIdRef.current, text }, (ack) => {
      if (!ack?.success) {
        console.error("Send error:", ack?.message);
        setInput(text);
      }
      setSending(false);
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-neutral-950 text-zinc-100">
      <UserNavbar />

      <div className="flex w-full flex-1 pt-16 md:pt-20">
        <main className="min-w-0 flex-1 px-5 py-6 sm:px-8">
          <div className="mx-auto flex h-[calc(100vh-10rem)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-neutral-900/60 border border-white/5 shadow-2xl shadow-black/40">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/")}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="flex items-center gap-2">
                  <MessageCircle size={18} className="text-red-500" />
                  <div>
                    <h1 className="text-sm font-semibold text-white">
                      Chat with Admin
                    </h1>
                    <p className="text-xs text-zinc-500">
                      We usually reply within a few hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
                  className="chat-scrollbar flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3 bg-neutral-950"
            >
              {loading ? (
                <div className="flex flex-1 items-center justify-center">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "#3f3f46 transparent #3f3f46 #3f3f46" }}
                  />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-1 items-center justify-center">
                  <p className="text-sm text-center text-zinc-500">
                    No messages yet. Say hello to our support team!
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.sender === "user";
                  return (
                    <div
                      key={msg._id}
                      className={`flex min-w-0 ${isMine ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className="max-w-[75%] min-w-0 px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words border"
                        style={{
                          overflowWrap: "anywhere",
                          background: isMine ? "#dc2626" : "#27272a",
                          color: isMine ? "#ffffff" : "#e4e4e7",
                          borderColor: isMine ? "#ef4444" : "rgba(255,255,255,0.06)",
                          borderBottomRightRadius: isMine ? "4px" : "16px",
                          borderBottomLeftRadius: isMine ? "16px" : "4px",
                        }}
                      >
                        {msg.text}
                        <div
                          className={`mt-1 text-[10px] ${
                            isMine ? "text-white/60" : "text-zinc-500"
                          }`}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 border-t border-white/10 px-4 py-3 bg-neutral-900/60"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-white/10 bg-neutral-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-red-500/50 focus:bg-neutral-800"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150"
                style={{
                  background: input.trim() ? "#dc2626" : "#27272a",
                  color: input.trim() ? "#ffffff" : "#71717a",
                  cursor: input.trim() ? "pointer" : "not-allowed",
                }}
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}