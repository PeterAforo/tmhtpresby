"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  Plus,
  Search,
  Users,
  User,
  MoreVertical,
  Phone,
  Video,
  ArrowLeft,
  Loader2,
  Check,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Participant {
  id: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
  lastReadAt: string;
}

interface Message {
  id: string;
  content: string;
  type: string;
  senderId: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
  createdAt: string;
  isEdited: boolean;
}

interface Conversation {
  id: string;
  type: string;
  name: string | null;
  imageUrl: string | null;
  participants: Participant[];
  messages: Message[];
  updatedAt: string;
  unreadCount?: number;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } else if (days === 1) {
    return "Yesterday";
  } else if (days < 7) {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  } else {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
}

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data.conversations || []);
      }
    } catch (err) {
      console.error("Failed to fetch conversations:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      const res = await fetch(`/api/messages/conversations/${conversationId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      fetchConversations();
    }
  }, [status, fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <Loader2 size={32} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login?callbackUrl=/community/messages");
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    try {
      const res = await fetch(`/api/messages/conversations/${selectedConversation.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [...prev, data.message]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      setSending(false);
    }
  };

  const getConversationName = (conv: Conversation) => {
    if (conv.name) return conv.name;
    if (conv.type === "direct") {
      const other = conv.participants.find((p) => p.user.id !== session?.user?.id);
      return other ? `${other.user.firstName} ${other.user.lastName}` : "Unknown";
    }
    return "Group Chat";
  };

  const getConversationAvatar = (conv: Conversation) => {
    if (conv.imageUrl) return conv.imageUrl;
    if (conv.type === "direct") {
      const other = conv.participants.find((p) => p.user.id !== session?.user?.id);
      return other?.user.image || null;
    }
    return null;
  };

  const filteredConversations = conversations.filter((conv) => {
    const name = getConversationName(conv).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-6xl mx-auto">
        <div className="flex h-[calc(100vh-64px)]">
          {/* Conversations sidebar */}
          <div
            className={cn(
              "w-full md:w-80 lg:w-96 border-r border-[var(--border)] flex flex-col bg-[var(--bg-card)]",
              selectedConversation && "hidden md:flex"
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-[var(--border)]">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-bold text-[var(--text)]">Messages</h1>
                <button
                  className="p-2 rounded-lg bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                  title="New conversation"
                >
                  <Plus size={18} />
                </button>
              </div>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Conversations list */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <MessageSquare size={32} className="mx-auto text-[var(--text-muted)] mb-2" />
                  <p className="text-sm text-[var(--text-muted)]">
                    {searchQuery ? "No conversations found" : "No messages yet"}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const name = getConversationName(conv);
                  const avatar = getConversationAvatar(conv);
                  const lastMessage = conv.messages[0];
                  const isSelected = selectedConversation?.id === conv.id;

                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={cn(
                        "w-full p-4 flex items-start gap-3 hover:bg-[var(--bg)] transition-colors text-left",
                        isSelected && "bg-[var(--accent)]/5 border-l-2 border-[var(--accent)]"
                      )}
                    >
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-semibold shrink-0">
                        {avatar ? (
                          <img src={avatar} alt={name} className="w-full h-full rounded-full object-cover" />
                        ) : conv.type === "group" ? (
                          <Users size={20} />
                        ) : (
                          name.split(" ").map((n) => n[0]).join("").slice(0, 2)
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-semibold text-[var(--text)] truncate">{name}</p>
                          {lastMessage && (
                            <span className="text-xs text-[var(--text-muted)]">
                              {formatTime(lastMessage.createdAt)}
                            </span>
                          )}
                        </div>
                        {lastMessage && (
                          <p className="text-xs text-[var(--text-muted)] truncate">
                            {lastMessage.senderId === session?.user?.id && "You: "}
                            {lastMessage.content}
                          </p>
                        )}
                      </div>

                      {/* Unread indicator */}
                      {conv.unreadCount && conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-white text-xs flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat area */}
          <div
            className={cn(
              "flex-1 flex flex-col",
              !selectedConversation && "hidden md:flex"
            )}
          >
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b border-[var(--border)] flex items-center justify-between bg-[var(--bg-card)]">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden p-2 -ml-2 text-[var(--text-muted)] hover:text-[var(--text)]"
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-semibold">
                      {getConversationAvatar(selectedConversation) ? (
                        <img
                          src={getConversationAvatar(selectedConversation)!}
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : selectedConversation.type === "group" ? (
                        <Users size={18} />
                      ) : (
                        getConversationName(selectedConversation).split(" ").map((n) => n[0]).join("").slice(0, 2)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text)]">
                        {getConversationName(selectedConversation)}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        {selectedConversation.type === "group"
                          ? `${selectedConversation.participants.length} members`
                          : "Online"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--accent)] transition-colors">
                      <Phone size={18} />
                    </button>
                    <button className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] hover:text-[var(--accent)] transition-colors">
                      <Video size={18} />
                    </button>
                    <button className="p-2 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg)] transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message, index) => {
                    const isOwn = message.senderId === session?.user?.id;
                    const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== message.senderId);

                    return (
                      <div
                        key={message.id}
                        className={cn("flex gap-2", isOwn && "justify-end")}
                      >
                        {!isOwn && showAvatar && (
                          <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] text-xs font-semibold shrink-0">
                            {message.sender.image ? (
                              <img
                                src={message.sender.image}
                                alt=""
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              `${message.sender.firstName[0]}${message.sender.lastName[0]}`
                            )}
                          </div>
                        )}
                        {!isOwn && !showAvatar && <div className="w-8" />}
                        <div
                          className={cn(
                            "max-w-[70%] px-4 py-2 rounded-2xl",
                            isOwn
                              ? "bg-[var(--accent)] text-white rounded-br-md"
                              : "bg-[var(--bg-card)] text-[var(--text)] border border-[var(--border)] rounded-bl-md"
                          )}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className={cn("flex items-center gap-1 mt-1", isOwn ? "justify-end" : "")}>
                            <span className={cn("text-xs", isOwn ? "text-white/70" : "text-[var(--text-muted)]")}>
                              {formatTime(message.createdAt)}
                            </span>
                            {isOwn && <CheckCheck size={12} className="text-white/70" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-[var(--border)] bg-[var(--bg-card)]">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 rounded-full text-sm bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="p-3 rounded-full bg-[var(--accent)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
                  <h2 className="text-lg font-semibold text-[var(--text)] mb-2">Your Messages</h2>
                  <p className="text-sm text-[var(--text-muted)] mb-4">
                    Select a conversation to start messaging
                  </p>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:opacity-90 transition-opacity">
                    <Plus size={16} />
                    New Conversation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
