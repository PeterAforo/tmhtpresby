"use client";

import { useState, useEffect, useCallback } from "react";
import { Mail, Trash2, Loader2, Phone, MessageSquare, Calendar } from "lucide-react";

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  createdAt: string;
}

export default function ContactsAdminPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contacts");
      if (res.ok) {
        const data = await res.json();
        setContacts(data.contacts || []);
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contact submission?")) return;
    try {
      await fetch(`/api/admin/contacts?id=${id}`, { method: "DELETE" });
      if (selectedContact?.id === id) setSelectedContact(null);
      fetchContacts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare size={24} className="text-[var(--accent)]" />
          Contact Submissions
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {contacts.length} message{contacts.length !== 1 ? "s" : ""} received
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contacts List */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-8 text-center">
              <Mail size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No contact submissions yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                    selectedContact?.id === contact.id ? "bg-[var(--accent)]/5 border-l-2 border-[var(--accent)]" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {contact.firstName} {contact.lastName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{contact.subject}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(contact.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Contact Detail */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          {selectedContact ? (
            <div>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedContact.firstName} {selectedContact.lastName}
                  </h2>
                  <p className="text-gray-600">{selectedContact.subject}</p>
                </div>
                <button
                  onClick={() => handleDelete(selectedContact.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${selectedContact.email}`} className="text-[var(--accent)] hover:underline">
                    {selectedContact.email}
                  </a>
                </div>
                {selectedContact.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone size={16} className="text-gray-400" />
                    <a href={`tel:${selectedContact.phone}`} className="text-gray-700">
                      {selectedContact.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={16} className="text-gray-400" />
                  {new Date(selectedContact.createdAt).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Message</h3>
                <p className="text-gray-600 whitespace-pre-wrap">{selectedContact.message}</p>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  <Mail size={16} /> Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <MessageSquare size={48} className="mb-3 opacity-50" />
              <p>Select a message to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
