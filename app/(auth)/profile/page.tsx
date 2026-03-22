import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/layout/PageHero";
import Link from "next/link";
import { User, Mail, Phone, Calendar, Shield, Users, LogOut, MessageSquare, BookOpen } from "lucide-react";

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  pastor: "Pastor / Senior Staff",
  ministry_leader: "Ministry Leader",
  member: "Member",
  visitor: "Visitor",
};

const groupLabels: Record<string, string> = {
  children: "Children's Ministry",
  youth: "Youth Ministry",
  young_adult: "Young Adults",
  adult: "Adult Fellowship",
  senior: "Senior Fellowship",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: { posts: true, replies: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <PageHero
        overline="My Account"
        title={`${user.firstName} ${user.lastName}`}
        subtitle={roleLabels[user.role] || "Member"}
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6">
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-4">
                  Profile Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User size={16} className="text-[var(--accent)] shrink-0" />
                    <span className="text-[var(--text-muted)]">Name:</span>
                    <span className="text-[var(--text)] font-medium">{user.firstName} {user.lastName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail size={16} className="text-[var(--accent)] shrink-0" />
                    <span className="text-[var(--text-muted)]">Email:</span>
                    <span className="text-[var(--text)] font-medium">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone size={16} className="text-[var(--accent)] shrink-0" />
                      <span className="text-[var(--text-muted)]">Phone:</span>
                      <span className="text-[var(--text)] font-medium">{user.phone}</span>
                    </div>
                  )}
                  {user.dateOfBirth && (
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar size={16} className="text-[var(--accent)] shrink-0" />
                      <span className="text-[var(--text-muted)]">Date of birth:</span>
                      <span className="text-[var(--text)] font-medium">
                        {new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(user.dateOfBirth)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm">
                    <Shield size={16} className="text-[var(--accent)] shrink-0" />
                    <span className="text-[var(--text-muted)]">Role:</span>
                    <span className="text-[var(--text)] font-medium">{roleLabels[user.role] || user.role}</span>
                  </div>
                  {user.ministryGroup && (
                    <div className="flex items-center gap-3 text-sm">
                      <Users size={16} className="text-[var(--accent)] shrink-0" />
                      <span className="text-[var(--text-muted)]">Ministry group:</span>
                      <span className="text-[var(--text)] font-medium">{groupLabels[user.ministryGroup] || user.ministryGroup}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity */}
              <div className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-6">
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-4">
                  Community Activity
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-[var(--accent)]/5 p-4 text-center">
                    <p className="text-2xl font-bold text-[var(--accent)]">{user._count.posts}</p>
                    <p className="text-xs text-[var(--text-muted)]">Discussion posts</p>
                  </div>
                  <div className="rounded-lg bg-[var(--primary)]/5 p-4 text-center">
                    <p className="text-2xl font-bold text-[var(--primary)]">{user._count.replies}</p>
                    <p className="text-xs text-[var(--text-muted)]">Replies</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar actions */}
            <div className="space-y-4">
              <Link href="/community" className="flex items-center gap-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4 hover:border-[var(--accent)]/40 hover:shadow-md transition-all duration-200">
                <MessageSquare size={20} className="text-[var(--accent)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">Community</p>
                  <p className="text-xs text-[var(--text-muted)]">Join discussions</p>
                </div>
              </Link>

              <Link href="/directory" className="flex items-center gap-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4 hover:border-[var(--accent)]/40 hover:shadow-md transition-all duration-200">
                <Users size={20} className="text-[var(--accent)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">Directory</p>
                  <p className="text-xs text-[var(--text-muted)]">Find members</p>
                </div>
              </Link>

              <Link href="/devotionals" className="flex items-center gap-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4 hover:border-[var(--accent)]/40 hover:shadow-md transition-all duration-200">
                <BookOpen size={20} className="text-[var(--accent)]" />
                <div>
                  <p className="text-sm font-semibold text-[var(--text)]">Devotionals</p>
                  <p className="text-xs text-[var(--text-muted)]">Daily readings</p>
                </div>
              </Link>

              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="w-full flex items-center gap-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4 hover:border-red-400/40 hover:shadow-md transition-all duration-200 text-left"
                >
                  <LogOut size={20} className="text-red-400" />
                  <div>
                    <p className="text-sm font-semibold text-red-500">Sign Out</p>
                    <p className="text-xs text-[var(--text-muted)]">End your session</p>
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
