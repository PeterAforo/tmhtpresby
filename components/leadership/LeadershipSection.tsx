"use client";

import { useState } from "react";
import Image from "next/image";
import { User, Mail, Phone, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeadershipMember {
  id: string;
  firstName: string;
  lastName: string;
  title?: string | null;
  email?: string | null;
  phone?: string | null;
  imageUrl?: string | null;
  bio?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
}

interface LeadershipPosition {
  id: string;
  title: string;
  description?: string | null;
  members: LeadershipMember[];
}

interface LeadershipGroup {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string | null;
  imageUrl?: string | null;
  positions: LeadershipPosition[];
}

interface LeadershipSectionProps {
  groups: LeadershipGroup[];
  showPastLeadership?: boolean;
  title?: string;
  subtitle?: string;
}

export function LeadershipSection({
  groups,
  showPastLeadership = false,
  title,
  subtitle,
}: LeadershipSectionProps) {
  const [showPast, setShowPast] = useState(false);

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-4" />
        <p className="text-[var(--text-muted)]">
          Leadership information coming soon.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--text)] mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>
      )}

      {groups.map((group) => (
        <div key={group.id} className="space-y-6">
          {groups.length > 1 && (
            <div className="border-b border-[var(--border)] pb-4">
              <h3 className="text-xl font-semibold text-[var(--text)]">
                {group.name}
              </h3>
              {group.description && (
                <p className="text-sm text-[var(--text-muted)] mt-1">
                  {group.description}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {group.positions.map((position) => {
              const currentMembers = position.members.filter((m) => m.isCurrent);
              const pastMembers = position.members.filter((m) => !m.isCurrent);

              return (
                <div key={position.id} className="space-y-4">
                  {currentMembers.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      positionTitle={position.title}
                    />
                  ))}

                  {showPastLeadership && showPast && pastMembers.length > 0 && (
                    <div className="space-y-4 opacity-75">
                      <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
                        Past {position.title}s
                      </p>
                      {pastMembers.map((member) => (
                        <MemberCard
                          key={member.id}
                          member={member}
                          positionTitle={position.title}
                          isPast
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {showPastLeadership && (
        <div className="text-center pt-4">
          <button
            onClick={() => setShowPast(!showPast)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--primary)] hover:bg-[var(--primary)]/5 rounded-lg transition-colors"
          >
            {showPast ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Past Leadership
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Past Leadership
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

interface MemberCardProps {
  member: LeadershipMember;
  positionTitle: string;
  isPast?: boolean;
}

function MemberCard({ member, positionTitle, isPast }: MemberCardProps) {
  const fullName = `${member.title ? member.title + " " : ""}${member.firstName} ${member.lastName}`;
  const startYear = new Date(member.startDate).getFullYear();
  const endYear = member.endDate ? new Date(member.endDate).getFullYear() : null;
  const tenure = endYear ? `${startYear} - ${endYear}` : `${startYear} - Present`;

  return (
    <div
      className={cn(
        "bg-[var(--bg-card)] rounded-xl border border-[var(--border)] overflow-hidden",
        isPast && "opacity-75"
      )}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {member.imageUrl ? (
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={member.imageUrl}
                  alt={fullName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                <User className="w-8 h-8 text-[var(--primary)]" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-[var(--text)] truncate">
              {fullName}
            </h4>
            <p className="text-sm text-[var(--primary)] font-medium">
              {positionTitle}
            </p>
            <div className="flex items-center gap-1 mt-1 text-xs text-[var(--text-muted)]">
              <Calendar className="w-3 h-3" />
              <span>{tenure}</span>
            </div>
          </div>
        </div>

        {member.bio && (
          <p className="mt-4 text-sm text-[var(--text-muted)] line-clamp-3">
            {member.bio}
          </p>
        )}

        {(member.email || member.phone) && (
          <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-2">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span className="truncate">{member.email}</span>
              </a>
            )}
            {member.phone && (
              <a
                href={`tel:${member.phone}`}
                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{member.phone}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
