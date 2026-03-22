import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Target, Heart, ArrowRight, Filter, CheckCircle } from "lucide-react";
import { prisma } from "@/lib/db";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects | The Most Holy Trinity Presbyterian Church",
  description: "Support our ongoing projects and help us make a difference in our community. View all church projects and donate to causes that matter.",
};

const categories = [
  { value: "all", label: "All Projects" },
  { value: "building", label: "Building" },
  { value: "education", label: "Education" },
  { value: "mission", label: "Mission" },
  { value: "community", label: "Community" },
];

async function getProjects() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: [
      { status: "asc" },
      { isFeatured: "desc" },
      { createdAt: "desc" },
    ],
  });
  return projects;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function getProgressPercentage(raised: number, goal: number | null) {
  if (!goal || goal === 0) return 0;
  return Math.min(Math.round((raised / goal) * 100), 100);
}

function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    building: "bg-blue-500",
    education: "bg-purple-500",
    mission: "bg-orange-500",
    community: "bg-green-500",
    general: "bg-gray-500",
  };
  return colors[category] || colors.general;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  const ongoingProjects = projects.filter((p) => p.status === "ongoing");
  const completedProjects = projects.filter((p) => p.status === "completed");

  const totalRaised = projects.reduce((sum, p) => sum + p.raisedAmount, 0);
  const totalGoal = projects.reduce((sum, p) => sum + (p.goalAmount || 0), 0);

  return (
    <>
      <PageHeroWithBackground
        pageSlug="projects"
        title="Our Projects"
        subtitle="Join us in making a difference. Your generous contributions help us serve our community and spread God's love."
        overline="Support Our Mission"
      />

      <main className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
              <p className="text-3xl lg:text-4xl font-bold text-[var(--accent)] mb-1">{projects.length}</p>
              <p className="text-sm text-[var(--text-muted)]">Total Projects</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
              <p className="text-3xl lg:text-4xl font-bold text-[var(--accent)] mb-1">{ongoingProjects.length}</p>
              <p className="text-sm text-[var(--text-muted)]">Ongoing</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
              <p className="text-3xl lg:text-4xl font-bold text-[var(--accent)] mb-1">{formatCurrency(totalRaised)}</p>
              <p className="text-sm text-[var(--text-muted)]">Total Raised</p>
            </div>
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
              <p className="text-3xl lg:text-4xl font-bold text-[var(--accent)] mb-1">{completedProjects.length}</p>
              <p className="text-sm text-[var(--text-muted)]">Completed</p>
            </div>
          </div>

          {/* Ongoing Projects */}
          {ongoingProjects.length > 0 && (
            <section className="mb-16">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                  <Target size={20} className="text-[var(--accent)]" />
                </div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl lg:text-3xl font-bold text-[var(--text)]">
                  Ongoing Projects
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {ongoingProjects.map((project) => {
                  const progress = getProgressPercentage(project.raisedAmount, project.goalAmount);

                  return (
                    <div
                      key={project.id}
                      className={cn(
                        "group rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)]",
                        "hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      )}
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={project.imageUrl || "/img/pictures/2/001.jpg"}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Category badge */}
                        <div
                          className={cn(
                            "absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-semibold uppercase tracking-wider",
                            getCategoryColor(project.category)
                          )}
                        >
                          {project.category}
                        </div>

                        {project.isFeatured && (
                          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-semibold">
                            Featured
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        {/* Progress bar */}
                        {project.goalAmount && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-[var(--text-muted)]">Raised</span>
                              <span className="font-semibold text-[var(--accent)]">{progress}%</span>
                            </div>
                            <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] rounded-full transition-all duration-500"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs mt-2 text-[var(--text-muted)]">
                              <span>{formatCurrency(project.raisedAmount)}</span>
                              <span>Goal: {formatCurrency(project.goalAmount)}</span>
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-3">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                          >
                            Read More
                            <ArrowRight size={14} />
                          </Link>
                          <Link
                            href={`/giving?project=${project.slug}`}
                            className="flex-1 inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
                          >
                            <Heart size={14} />
                            Donate
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Completed Projects */}
          {completedProjects.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle size={20} className="text-green-500" />
                </div>
                <h2 className="font-[family-name:var(--font-heading)] text-2xl lg:text-3xl font-bold text-[var(--text)]">
                  Completed Projects
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {completedProjects.map((project) => (
                  <div
                    key={project.id}
                    className={cn(
                      "group rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)]",
                      "hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    )}
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.imageUrl || "/img/pictures/2/001.jpg"}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Completed badge */}
                      <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold flex items-center gap-1">
                        <CheckCircle size={12} />
                        Completed
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[var(--text)] mb-2 line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
                        {project.description}
                      </p>

                      {/* Final amount */}
                      {project.goalAmount && (
                        <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-center">
                          <p className="text-sm text-green-600 dark:text-green-400">
                            Successfully raised <span className="font-bold">{formatCurrency(project.raisedAmount)}</span>
                          </p>
                        </div>
                      )}

                      {/* Read More */}
                      <Link
                        href={`/projects/${project.slug}`}
                        className="w-full inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                      >
                        View Project
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {projects.length === 0 && (
            <div className="text-center py-16">
              <Target size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
              <h3 className="text-xl font-semibold text-[var(--text)] mb-2">No Projects Yet</h3>
              <p className="text-[var(--text-muted)]">Check back soon for upcoming projects.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
