import { useState } from "react";
import { Mail, Send, Eye } from "lucide-react";
import toast from "react-hot-toast";

import { PRIMARY_GRADIENT } from "../../../components/AdminComponents/Theme";
import { Card, Label, HelpText } from "../../../components/AdminComponents/UiComponents";
import { Sidebar } from "../../../components/AdminComponents/Sidebar";
import { Header } from "../../../components/AdminComponents/Navbar";
import api from "../../../services/api";

const TEMPLATES = [
  {
    value: "newsletter",
    label: "Newsletter",
    description: "Latest updates and news from WheelsRUs",
    subject: "Latest Updates from WheelsRUs",
    preview: "Hi {name}, here are the latest updates from WheelsRUs! We've been working hard to bring you the best Hot Wheels die-cast cars and exclusive collections.",
  },
  {
    value: "promotion",
    label: "Promotion",
    description: "Special offers and sales for customers",
    subject: "Special Offer Just for You!",
    preview: "Hi {name}, we have an exclusive offer just for you! For a limited time, enjoy special prices on select Hot Wheels die-cast cars from our premium collection.",
  },
  {
    value: "announcement",
    label: "Announcement",
    description: "New arrivals and product launches",
    subject: "Exciting New Arrivals at WheelsRUs!",
    preview: "Hi {name}, we're thrilled to announce brand new arrivals at WheelsRUs! Our latest collection features rare and exclusive Hot Wheels die-cast cars.",
  },
];

export default function BulkEmail() {
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const activeTemplate = TEMPLATES.find((t) => t.value === selectedTemplate);

  const handleSend = async () => {
    if (!selectedTemplate) {
      toast.error("Please select a template first");
      return;
    }

    setSending(true);
    try {
      const { data } = await api.post("/admin/bulk-email", {
        templateType: selectedTemplate,
      });
      toast.success(`${data.queued} emails queued successfully!`);
      setSelectedTemplate("");
      setShowPreview(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to queue emails");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex w-full min-h-screen" style={{ background: "#0a0b14", fontFamily: "Fredoka, system-ui, sans-serif" }}>
      <Sidebar />
      <main className="flex-1 px-8 py-6">
        <Header />

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Bulk Email</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Template selector */}
          <div className="lg:col-span-2">
            <Card title="Select Template" icon={Mail}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TEMPLATES.map((template) => (
                  <button
                    key={template.value}
                    onClick={() => {
                      setSelectedTemplate(template.value);
                      setShowPreview(true);
                    }}
                    className="text-left p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                    style={{
                      border: `2px solid ${selectedTemplate === template.value ? "#7c3aed" : "#23263a"}`,
                      background: selectedTemplate === template.value ? "rgba(124,58,237,0.1)" : "#171a2b",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={16} style={{ color: selectedTemplate === template.value ? "#7c3aed" : "#8b90a8" }} />
                      <span className="font-semibold text-sm" style={{ color: selectedTemplate === template.value ? "#ffffff" : "#e5e7eb" }}>
                        {template.label}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: "#8b90a8" }}>
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Preview */}
            {showPreview && activeTemplate && (
              <div className="mt-6">
                <Card title="Email Preview" icon={Eye}>
                  <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #23263a" }}>
                    <div className="px-4 py-3" style={{ background: "#171a2b", borderBottom: "1px solid #23263a" }}>
                      <div className="text-xs" style={{ color: "#8b90a8" }}>
                        <span className="font-medium" style={{ color: "#e5e7eb" }}>To:</span> All Registered Users
                      </div>
                      <div className="text-xs mt-1" style={{ color: "#8b90a8" }}>
                        <span className="font-medium" style={{ color: "#e5e7eb" }}>Subject:</span> {activeTemplate.subject}
                      </div>
                    </div>
                    <div className="p-4" style={{ background: "#0f1019" }}>
                      <p className="text-sm" style={{ color: "#e5e7eb", lineHeight: 1.6 }}>
                        {activeTemplate.preview}
                      </p>
                      <div className="mt-4 text-center">
                        <span
                          className="inline-block px-6 py-2 rounded-lg text-xs font-semibold text-white"
                          style={{ background: PRIMARY_GRADIENT }}
                        >
                          View Collection
                        </span>
                      </div>
                    </div>
                  </div>
                  <HelpText>
                    The email will be personalized with each user's name.
                    A branded HTML template with your store link will be sent.
                  </HelpText>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar info */}
          <div className="lg:col-span-1">
            <Card title="How it Works" icon={Send}>
              <div className="flex flex-col gap-4 text-sm" style={{ color: "#8b90a8" }}>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: PRIMARY_GRADIENT, color: "#fff" }}>1</span>
                  <p>Select a predefined email template from the options.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: PRIMARY_GRADIENT, color: "#fff" }}>2</span>
                  <p>Preview the email content before sending.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: PRIMARY_GRADIENT, color: "#fff" }}>3</span>
                  <p>Click "Send" to queue all emails via RabbitMQ.</p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: PRIMARY_GRADIENT, color: "#fff" }}>4</span>
                  <p>Background worker sends each email through Resend.</p>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl text-xs" style={{ background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", color: "#8b90a8" }}>
                Emails are processed asynchronously via RabbitMQ queue. You can close this page after sending.
              </div>
            </Card>

            {/* Send button */}
            <div className="mt-6">
              <button
                onClick={handleSend}
                disabled={!selectedTemplate || sending}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{ background: PRIMARY_GRADIENT }}
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "#ffffff transparent #ffffff #ffffff" }} />
                    Queuing...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send to All Users
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
