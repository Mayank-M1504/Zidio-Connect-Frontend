import React, { useEffect, useState, useRef } from 'react';
import { getMessages, sendMessage } from '../lib/api';

interface Message {
  id: number;
  senderEmail: string;
  senderRole: string;
  receiverEmail: string;
  receiverRole: string;
  content: string;
  sentAt: string;
  applicationId: number;
}

interface MessageModalProps {
  applicationId: number;
  receiverEmail: string;
  receiverRole: string;
  isOpen: boolean;
  onClose: () => void;
  currentUserEmail: string;
  currentUserRole: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ applicationId, receiverEmail, receiverRole, isOpen, onClose, currentUserEmail, currentUserRole }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) fetchMessages();
    // eslint-disable-next-line
  }, [isOpen]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const msgs = await getMessages(applicationId);
      setMessages(Array.isArray(msgs) ? msgs : []);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    setError('');
    try {
      await sendMessage({
        receiverEmail,
        receiverRole,
        content: newMessage,
        applicationId,
      });
      setNewMessage('');
      fetchMessages();
      if (inputRef.current) inputRef.current.focus();
    } catch (err: any) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 flex flex-col" style={{ minHeight: 500, maxHeight: 700 }}>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Chat</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl font-bold leading-none px-3 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto mb-2" style={{ minHeight: 350, maxHeight: 500 }}>
          {loading ? (
            <div>Loading...</div>
          ) : (
            messages.length === 0 ? (
              <div className="text-gray-400 text-center">No messages yet.</div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`mb-2 flex ${msg.senderEmail === currentUserEmail ? 'justify-end' : 'justify-start'}`}>
                  <div className={`rounded px-3 py-2 ${msg.senderEmail === currentUserEmail ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    <div className="text-xs opacity-70 mb-1">{msg.senderEmail}</div>
                    <div>{msg.content}</div>
                    <div className="text-xs opacity-50 mt-1 text-right">{new Date(msg.sentAt).toLocaleString()}</div>
                  </div>
                </div>
              ))
            )
          )}
          <div ref={messagesEndRef} />
        </div>
        {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
        <div className="flex gap-2 mt-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 border rounded px-2 py-2 text-base"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder="Type a message..."
            disabled={sending}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-6 py-2 rounded text-base disabled:opacity-50"
            disabled={sending || !newMessage.trim()}
          >
            {sending ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal; 