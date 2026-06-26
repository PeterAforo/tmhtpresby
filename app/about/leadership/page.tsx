import type { Metadata } from "next";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { Mail } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "Meet the pastors, elders, and deacons who lead The Most Holy Trinity Presbyterian Church.",
};

async function getLeadership() {
  try {
    const groups = await prisma.leadershipGroup.findMany({
      where: {
        isActive: true,
      },
      include: {
        positions: {
          include: {
            members: {
              where: { isCurrent: true },
              orderBy: { startDate: "desc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    });

    // Flatten all members from all groups and positions
    const allMembers = groups.flatMap((group) =>
      group.positions.flatMap((position) =>
        position.members.map((member) => ({
          id: member.id,
          name: `${member.firstName} ${member.lastName}`,
          role: position.title || member.title || "Leader",
          bio: member.bio || "",
          imageUrl: member.imageUrl || "",
          email: member.email || "",
          order: position.order,
        }))
      )
    );

    return allMembers;
  } catch (error) {
    console.error("Error fetching leadership:", error);
    return [];
  }
}

export default async function LeadershipPage() {
  const leaders = await getLeadership();

  return (
    <>
      <PageHeroWithBackground
        pageSlug="about-leadership"
        overline="About"
        title="Our Leadership"
        subtitle="Meet the pastors and elders who shepherd our church family with love and integrity."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {leaders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[var(--text-muted)]">No leadership information available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaders.map((leader) => (
                <div
                  key={leader.id}
                  className="group rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-200"
                >
                  {/* Photo placeholder */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-[var(--accent)]/10 to-[var(--primary)]/10 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                      <span className="text-2xl font-bold text-[var(--accent)]">
                        {leader.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <p className="text-xs font-semibold text-[var(--accent)] uppercase tracking-wider mb-1">
                      {leader.role}
                    </p>
                    <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
                      {leader.name}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4">
                      {leader.bio}
                    </p>
                    {leader.email && (
                      <a
                        href={`mailto:${leader.email}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:underline"
                      >
                        <Mail size={14} />
                        {leader.email}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
