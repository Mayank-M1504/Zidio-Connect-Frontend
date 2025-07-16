import React, { useEffect, useRef, useState } from "react";
import { getMessages, sendMessage } from "@/lib/api";
import { XCircle, Send } from "lucide-react";

interface MessageModalProps {
  applicationId: number;
  onClose: () => void;
}

export default function MessageModal({ applicationId, onClose }: MessageModalProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const msgs = await getMessages(applicationId);
      setMessages(msgs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Remove polling interval: only fetch on mount/open
    // const interval = setInterval(fetchMessages, 4000); // Poll every 4s
    // return () => clearInterval(interval);
  }, [applicationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setSending(true);
    try {
      await sendMessage(applicationId, input);
      setInput("");
      fetchMessages();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Chat</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {loading ? (
            <div className="text-center text-gray-400">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400">No messages yet.</div>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg.id || idx} className={`flex flex-col ${msg.senderRole === "RECRUITER" ? "items-end" : "items-start"}`}>
                <div className={`px-4 py-2 rounded-lg max-w-xs ${msg.senderRole === "RECRUITER" ? "bg-blue-100 text-blue-900" : "bg-gray-200 text-gray-900"}`}>
                  {msg.content}
                </div>
                <span className="text-xs text-gray-400 mt-1">{new Date(msg.timestamp).toLocaleString()}</span>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleSend(); }}
            disabled={sending}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-1 disabled:opacity-50"
            onClick={handleSend}
            disabled={sending || !input.trim()}
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 