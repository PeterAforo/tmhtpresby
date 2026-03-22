import { PageHero } from "@/components/layout/PageHero";
import { Building2 } from "lucide-react";

export const metadata = {
  title: "Departments",
  description: "Learn about the departments of The Most Holy Trinity Presbyterian Church.",
};

const departments = [
  { name: "Worship Department", description: "Coordinates all worship activities and services" },
  { name: "Christian Education", description: "Oversees Sunday School and Bible study programs" },
  { name: "Evangelism Department", description: "Leads outreach and evangelism efforts" },
  { name: "Welfare Department", description: "Provides support to members in need" },
  { name: "Finance Department", description: "Manages church finances and budgeting" },
  { name: "Property Department", description: "Maintains church buildings and facilities" },
];

export default function DepartmentsPage() {
  return (
    <>
      <PageHero
        title="Departments"
        subtitle="Our church departments"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none mb-12">
              <p className="text-[var(--text-muted)]">
                Our church is organized into various departments, each responsible for 
                specific aspects of church life and ministry. These departments work 
                together to ensure the effective functioning of our congregation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {departments.map((dept) => (
                <div
                  key={dept.name}
                  className="bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border)]"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text)] mb-2">
                        {dept.name}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)]">
                        {dept.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
