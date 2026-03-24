"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Globe,
  Palette,
  Bell,
  Mail,
  Shield,
  Save,
  Loader2,
  Church,
  MapPin,
  Phone,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  serviceTime: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  twitterUrl: string;
  primaryColor: string;
  accentColor: string;
  enableDarkMode: boolean;
  enableNotifications: boolean;
  enableNewsletter: boolean;
  maintenanceMode: boolean;
  googleAnalyticsId: string;
  metaTitle: string;
  metaDescription: string;
}

const defaultSettings: SiteSettings = {
  siteName: "TMHT Presbyterian Church",
  tagline: "A Place of Worship, Fellowship & Growth",
  description: "Welcome to Tema Manhean Town Presbyterian Church - a vibrant community of believers.",
  email: "info@tmhtpresby.org",
  phone: "+233 XX XXX XXXX",
  address: "Lashibi, Tema, Greater Accra, Ghana",
  serviceTime: "Sundays at 8:00 AM & 10:30 AM",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  twitterUrl: "",
  primaryColor: "#0C1529",
  accentColor: "#3D4DB7",
  enableDarkMode: true,
  enableNotifications: true,
  enableNewsletter: true,
  maintenanceMode: false,
  googleAnalyticsId: "",
  metaTitle: "",
  metaDescription: "",
};

type TabId = "general" | "appearance" | "social" | "notifications" | "seo" | "advanced";

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: Church },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "social", label: "Social Media", icon: Globe },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "seo", label: "SEO", icon: Globe },
  { id: "advanced", label: "Advanced", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/admin/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings({ ...defaultSettings, ...data });
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  }

  const inputClasses = cn(
    "w-full px-4 py-2.5 rounded-lg text-sm",
    "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]",
    "focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)] flex items-center gap-2">
            <Settings size={24} className="text-[var(--accent)]" />
            Site Settings
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Configure your church website settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={cn(
            "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all",
            saved
              ? "bg-green-500 text-white"
              : "bg-[var(--accent)] text-white hover:opacity-90",
            saving && "opacity-60"
          )}
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : saved ? (
            "Saved!"
          ) : (
            <>
              <Save size={16} /> Save Changes
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-48 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab.id
                  ? "bg-[var(--accent)] text-white"
                  : "text-[var(--text-muted)] hover:bg-[var(--border)]/50 hover:text-[var(--text)]"
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">General Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    <Church size={14} className="inline mr-1" /> Site Name
                  </label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  className={inputClasses}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    <Mail size={14} className="inline mr-1" /> Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    <Phone size={14} className="inline mr-1" /> Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  <MapPin size={14} className="inline mr-1" /> Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  <Clock size={14} className="inline mr-1" /> Service Times
                </label>
                <input
                  type="text"
                  value={settings.serviceTime}
                  onChange={(e) => setSettings({ ...settings, serviceTime: e.target.value })}
                  placeholder="e.g., Sundays at 8:00 AM & 10:30 AM"
                  className={inputClasses}
                />
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Appearance Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    Primary Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer border border-[var(--border)]"
                    />
                    <input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className={cn(inputClasses, "flex-1")}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    Accent Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer border border-[var(--border)]"
                    />
                    <input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                      className={cn(inputClasses, "flex-1")}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableDarkMode}
                    onChange={(e) => setSettings({ ...settings, enableDarkMode: e.target.checked })}
                    className="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  <div>
                    <span className="text-sm font-medium text-[var(--text)]">Enable Dark Mode</span>
                    <p className="text-xs text-[var(--text-muted)]">Allow users to switch to dark theme</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Social Media Links</h2>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  <Facebook size={14} className="inline mr-1" /> Facebook URL
                </label>
                <input
                  type="url"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/yourpage"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  <Instagram size={14} className="inline mr-1" /> Instagram URL
                </label>
                <input
                  type="url"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/yourpage"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  <Youtube size={14} className="inline mr-1" /> YouTube URL
                </label>
                <input
                  type="url"
                  value={settings.youtubeUrl}
                  onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/@yourchannel"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  <Twitter size={14} className="inline mr-1" /> Twitter/X URL
                </label>
                <input
                  type="url"
                  value={settings.twitterUrl}
                  onChange={(e) => setSettings({ ...settings, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/yourhandle"
                  className={inputClasses}
                />
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Notification Settings</h2>
              
              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--bg)]">
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <div>
                  <span className="text-sm font-medium text-[var(--text)]">Push Notifications</span>
                  <p className="text-xs text-[var(--text-muted)]">Enable browser push notifications for members</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--bg)]">
                <input
                  type="checkbox"
                  checked={settings.enableNewsletter}
                  onChange={(e) => setSettings({ ...settings, enableNewsletter: e.target.checked })}
                  className="w-5 h-5 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <div>
                  <span className="text-sm font-medium text-[var(--text)]">Newsletter Signup</span>
                  <p className="text-xs text-[var(--text-muted)]">Show newsletter subscription form on the website</p>
                </div>
              </label>
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">SEO Settings</h2>
              
              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  Default Meta Title
                </label>
                <input
                  type="text"
                  value={settings.metaTitle}
                  onChange={(e) => setSettings({ ...settings, metaTitle: e.target.value })}
                  placeholder="TMHT Presbyterian Church | Tema, Ghana"
                  className={inputClasses}
                />
                <p className="text-xs text-[var(--text-muted)] mt-1">Leave empty to use site name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  Default Meta Description
                </label>
                <textarea
                  rows={3}
                  value={settings.metaDescription}
                  onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                  placeholder="Welcome to TMHT Presbyterian Church..."
                  className={inputClasses}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={settings.googleAnalyticsId}
                  onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                  className={inputClasses}
                />
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-[var(--text)] mb-4">Advanced Settings</h2>
              
              <div className="p-4 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                    className="w-5 h-5 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Maintenance Mode</span>
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      When enabled, visitors will see a maintenance page. Admins can still access the site.
                    </p>
                  </div>
                </label>
              </div>

              <div className="pt-4 border-t border-[var(--border)]">
                <h3 className="text-sm font-medium text-[var(--text)] mb-3">Danger Zone</h3>
                <button className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20">
                  Clear All Cache
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
