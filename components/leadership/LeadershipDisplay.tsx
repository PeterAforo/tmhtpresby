"use client";

import { useEffect, useState } from "react";
import { LeadershipSection } from "./LeadershipSection";
import { Loader2 } from "lucide-react";

interface LeadershipDisplayProps {
  type: string;
  showPastLeadership?: boolean;
  title?: string;
  subtitle?: string;
}

export function LeadershipDisplay({
  type,
  showPastLeadership = false,
  title,
  subtitle,
}: LeadershipDisplayProps) {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeadership() {
      try {
        const res = await fetch(
          `/api/leadership/${type}?includePast=${showPastLeadership}`
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setGroups(data);
      } catch (err) {
        setError("Unable to load leadership information");
      } finally {
        setLoading(false);
      }
    }

    fetchLeadership();
  }, [type, showPastLeadership]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-[var(--primary)] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-muted)]">{error}</p>
      </div>
    );
  }

  return (
    <LeadershipSection
      groups={groups}
      showPastLeadership={showPastLeadership}
      title={title}
      subtitle={subtitle}
    />
  );
}
