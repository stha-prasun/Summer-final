import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Sidebar } from "../../../components/AdminComponents/Sidebar";
import { Header } from "../../../components/AdminComponents/Navbar";
import {
  CARD_BG,
  CARD_BORDER,
  INPUT_BG,
  TEXT_MUTED,
  TEXT_FAINT,
  TABLE_BORDER,
} from "../../../components/AdminComponents/Theme";
import api from "../../../services/api";
import { connectSocket } from "../../../services/socket";

export default function AdminChat() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);
  const selectedRef = useRef(null);
  const socketRef = useRef(null);

  const fetchConversations = useCallback(async () => {
    try {
      const { data } = await api.get("/chat/admin/conversations");
      setConversations(data.conversations || []);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    } finally {
      setLoadingConvos(false);
    }
  }, []);

  const fetchMessages = useCallback(async (convoId) => {
    if (!convoId) return;
    try {
      const { data } = await api.get(`/chat/admin/${convoId}/messages`);
      setMessages(data.messages || []);
      await api.patch(`/chat/admin/${convoId}/read`);
    } catch {
      // silent
    }
  }, []);

  const markConversationRead = useCallback(
    (convoId) => {
      const socket = connectSocket();
      socket.emit("markRead", { conversationId: convoId });
      setConversations((prev) =>
        prev.map((c) => (c._id === convoId ? { ...c, unreadByAdmin: 0 } : c))
      );
    },
    []
  );

  useEffect(() => {
    fetchConversations();

    const socket = connectSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      fetchConversations();
      if (selectedRef.current) {
        socket.emit("joinConversation", selectedRef.current);
      }
    });

    socket.on("chat:update", ({ conversationId: cid }) => {
      fetchConversations();
      if (cid && cid === selectedRef.current) {
        fetchMessages(cid);
      } else if (selectedRef.current) {
        fetchMessages(selectedRef.current);
      }
    });

    socket.on("message:new", ({ conversationId: cid, message }) => {
      if (cid === selectedRef.current) {
        setMessages((prev) => [...prev, message]);
        markConversationRead(cid);
      } else {
        fetchConversations();
      }
    });

    return () => {
      socket.off("chat:update");
      socket.off("message:new");
      socket.off("connect");
    };
  }, [fetchConversations, fetchMessages, markConversationRead]);

  useEffect(() => {
    if (!selectedId) return;
    selectedRef.current = selectedId;
    setLoadingMessages(true);
    fetchMessages(selectedId).finally(() => setLoadingMessages(false));
    markConversationRead(selectedId);

    const socket = connectSocket();
    socket.emit("joinConversation", selectedId);

    return () => {
      socket.emit("leaveConversation", selectedId);
    };
  }, [selectedId, fetchMessages, markConversationRead]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
      if (selectedRef.current) {
        fetchMessages(selectedRef.current);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchConversations, fetchMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSelect = (convoId) => {
    setSelectedId(convoId);
    markConversationRead(convoId);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || sending || !selectedRef.current) return;

    setSending(true);
    const text = input.trim();
    setInput("");

    const socket = connectSocket();
    socket.emit("sendMessage", { conversationId: selectedRef.current, text }, (ack) => {
      if (!ack?.success) {
        console.error("Send error:", ack?.message);
        setInput(text);
      }
      setSending(false);
    });
  };

  const selectedConvo = conversations.find((c) => c._id === selectedId);

  return (
    <div
      className="flex w-full min-h-screen"
      style={{ background: "#0a0b14", fontFamily: "Fredoka, system-ui, sans-serif" }}
    >
      <Sidebar />
      <main className="flex-1 px-8 py-6">
        <Header />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Customer Chat</h1>
        </div>

        <div
          className="grid grid-cols-1 lg:grid-cols-3 overflow-hidden rounded-2xl"
          style={{ background: CARD_BG, border: `1px solid ${CARD_BORDER}` }}
        >
          {/* Conversation list */}
          <div
            className="lg:col-span-1 border-b lg:border-b-0 lg:border-r flex flex-col"
            style={{ borderColor: TABLE_BORDER }}
          >
            <div
              className="px-5 py-4 text-sm font-semibold text-white"
              style={{ borderBottom: `1px solid ${TABLE_BORDER}` }}
            >
              Conversations
            </div>
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: "60vh" }}>
              {loadingConvos ? (
                <div className="flex items-center justify-center py-16">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: "#8b90a8 transparent #8b90a8 #8b90a8" }}
                  />
                </div>
              ) : conversations.length === 0 ? (
                <div className="py-16 text-center text-sm" style={{ color: TEXT_MUTED }}>
                  No conversations yet.
                </div>
              ) : (
                conversations.map((convo) => {
                  const isActive = convo._id === selectedId;
                  const hasUnread = convo.unreadByAdmin > 0;
                  return (
                    <button
                      key={convo._id}
                      onClick={() => handleSelect(convo._id)}
                      className="w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors duration-150"
                      style={{
                        background: isActive ? "rgba(124,58,237,0.12)" : "transparent",
                        borderBottom: `1px solid ${TABLE_BORDER}`,
                      }}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white truncate">
                            {convo.user?.name || "Customer"}
                          </span>
                          {hasUnread && (
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ background: "#fbbf24" }}
                            />
                          )}
                        </div>
                        <div className="text-xs mt-0.5 truncate" style={{ color: TEXT_MUTED }}>
                          {convo.lastMessage || "No messages yet"}
                        </div>
                        <div className="text-[10px] mt-0.5" style={{ color: TEXT_FAINT }}>
                          {convo.lastMessageAt
                            ? new Date(convo.lastMessageAt).toLocaleString()
                            : ""}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Message thread */}
          <div className="lg:col-span-2 flex flex-col h-[60vh]">
            {!selectedId ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                <MessageCircle size={32} style={{ color: TEXT_FAINT }} />
                <p className="text-sm" style={{ color: TEXT_MUTED }}>
                  Select a conversation to start chatting
                </p>
              </div>
            ) : (
              <>
                <div
                  className="flex items-center justify-between px-5 py-4"
                  style={{ borderBottom: `1px solid ${TABLE_BORDER}` }}
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} style={{ color: "#7c3aed" }} />
                    <span className="text-sm font-semibold text-white">
                      {selectedConvo?.user?.name || "Customer"}
                    </span>
                  </div>
                </div>

                <div
                  ref={scrollRef}
                  className="chat-scrollbar flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3"
                >
                  {loadingMessages ? (
                    <div className="flex flex-1 items-center justify-center">
                      <div
                        className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                        style={{ borderColor: "#8b90a8 transparent #8b90a8 #8b90a8" }}
                      />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center">
                      <p className="text-sm" style={{ color: TEXT_MUTED }}>
                        No messages in this conversation yet.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMine = msg.sender === "admin";
                      return (
                        <div
                          key={msg._id}
                          className={`flex min-w-0 ${isMine ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className="max-w-[75%] min-w-0 px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words"
                            style={{
                              overflowWrap: "anywhere",
                              background: isMine
                                ? "linear-gradient(90deg,#7c3aed,#2563eb)"
                                : INPUT_BG,
                              color: isMine ? "#ffffff" : "#c7cad6",
                              borderBottomRightRadius: isMine ? "4px" : "16px",
                              borderBottomLeftRadius: isMine ? "16px" : "4px",
                            }}
                          >
                            {msg.text}
                            <div
                              className={`mt-1 text-[10px] ${
                                isMine ? "text-white/60" : "text-slate-500"
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

                <form
                  onSubmit={handleSend}
                  className="flex items-center gap-2 px-4 py-3"
                  style={{ borderTop: `1px solid ${TABLE_BORDER}` }}
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: INPUT_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      color: "#e5e7eb",
                    }}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150"
                    style={{
                      background: input.trim()
                        ? "linear-gradient(90deg,#7c3aed,#2563eb)"
                        : INPUT_BG,
                      color: input.trim() ? "#ffffff" : TEXT_FAINT,
                      cursor: input.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}