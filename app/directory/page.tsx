import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/layout/PageHero";
import { User, Mail, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const roleLabels: Record<string, string> = {
  super_admin: "Admin",
  pastor: "Pastor",
  ministry_leader: "Leader",
  member: "Member",
  visitor: "Visitor",
};

const roleBadges: Record<string, string> = {
  super_admin: "bg-red-100 text-red-700",
  pastor: "bg-[var(--accent)]/10 text-[var(--accent)]",
  ministry_leader: "bg-purple-100 text-purple-700",
  member: "bg-emerald-100 text-emerald-700",
  visitor: "bg-gray-100 text-gray-600",
};

const groupLabels: Record<string, string> = {
  children: "Children",
  youth: "Youth",
  young_adult: "Young Adults",
  adult: "Adults",
  senior: "Seniors",
};

async function getMembers() {
  try {
    return await prisma.user.findMany({
      where: { isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        role: true,
        ministryGroup: true,
        bio: true,
      },
      orderBy: [{ role: "asc" }, { firstName: "asc" }],
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}

export default async function DirectoryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const members = await getMembers();

  // Group by ministry
  const grouped = members.reduce<Record<string, typeof members>>((acc, member) => {
    const group = member.ministryGroup || "unassigned";
    if (!acc[group]) acc[group] = [];
    acc[group].push(member);
    return acc;
  }, {});

  const groupOrder = ["adult", "young_adult", "youth", "children", "senior", "unassigned"];

  return (
    <>
      <PageHero
        overline="Community"
        title="Member Directory"
        subtitle="Connect with your church family."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[var(--text-muted)] mb-8">
            {members.length} member{members.length !== 1 ? "s" : ""} in the directory
          </p>

          {groupOrder.map((group) => {
            const groupMembers = grouped[group];
            if (!groupMembers || groupMembers.length === 0) return null;

            return (
              <div key={group} className="mb-10">
                <h2 className="flex items-center gap-2 font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-4">
                  <Users size={18} className="text-[var(--accent)]" />
                  {groupLabels[group] || "Other"}
                  <span className="text-sm font-normal text-[var(--text-muted)]">({groupMembers.length})</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupMembers.map((member) => (
                    <div
                      key={member.id}
                      className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4 flex items-start gap-4"
                    >
                      <div className="shrink-0 w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                        {member.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={member.image} alt="" className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                          <User size={20} className="text-[var(--accent)]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-[var(--text)] truncate">
                            {member.firstName} {member.lastName}
                          </p>
                          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold shrink-0", roleBadges[member.role] || "bg-gray-100 text-gray-600")}>
                            {roleLabels[member.role] || member.role}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)] flex items-center gap-1 truncate">
                          <Mail size={11} /> {member.email}
                        </p>
                        {member.bio && (
                          <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">{member.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {members.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-[var(--text-muted)]">No members in the directory yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
