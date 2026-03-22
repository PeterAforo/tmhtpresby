import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft, Calendar, Target, CheckCircle, Share2 } from "lucide-react";
import { prisma } from "@/lib/db";
import { cn } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProject(slug: string) {
  const project = await prisma.project.findUnique({
    where: { slug, isPublished: true },
  });
  return project;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return { title: "Project Not Found" };
  }

  return {
    title: `${project.title} | The Most Holy Trinity Presbyterian Church`,
    description: project.description,
  };
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
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

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const progress = getProgressPercentage(project.raisedAmount, project.goalAmount);
  const isCompleted = project.status === "completed";

  return (
    <>
      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-24">
        <div className="relative h-[40vh] min-h-[300px] lg:min-h-[400px]">
          <Image
            src={project.imageUrl || "/img/pictures/2/001.jpg"}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

          {/* Back button */}
          <div className="absolute top-6 left-6">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm font-medium hover:bg-white/30 transition-colors"
            >
              <ArrowLeft size={16} />
              All Projects
            </Link>
          </div>

          {/* Category & Status badges */}
          <div className="absolute top-6 right-6 flex gap-2">
            <span
              className={cn(
                "px-3 py-1 rounded-full text-white text-xs font-semibold uppercase tracking-wider",
                getCategoryColor(project.category)
              )}
            >
              {project.category}
            </span>
            {isCompleted && (
              <span className="px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold flex items-center gap-1">
                <CheckCircle size={12} />
                Completed
              </span>
            )}
          </div>
        </div>
      </section>

      <main className="py-12 lg:py-16 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text)] mb-4">
                {project.title}
              </h1>

              <p className="text-lg text-[var(--text-muted)] mb-8">
                {project.description}
              </p>

              {/* Dates */}
              <div className="flex flex-wrap gap-4 mb-8">
                {project.startDate && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <Calendar size={16} />
                    <span>Started: {formatDate(project.startDate)}</span>
                  </div>
                )}
                {project.endDate && (
                  <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <Target size={16} />
                    <span>Target: {formatDate(project.endDate)}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              {project.content && (
                <div
                  className="prose prose-lg dark:prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.content }}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Donation Card */}
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-lg">
                  {project.goalAmount && (
                    <>
                      {/* Progress */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold text-[var(--text)]">
                            {formatCurrency(project.raisedAmount)}
                          </span>
                          <span className="text-sm text-[var(--text-muted)]">
                            of {formatCurrency(project.goalAmount)}
                          </span>
                        </div>
                        <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden mb-2">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              isCompleted
                                ? "bg-green-500"
                                : "bg-gradient-to-r from-[var(--accent)] to-[var(--primary)]"
                            )}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-sm text-[var(--text-muted)]">
                          <span className="font-semibold text-[var(--accent)]">{progress}%</span> funded
                        </p>
                      </div>
                    </>
                  )}

                  {!isCompleted ? (
                    <>
                      <Link
                        href={`/giving?project=${project.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold bg-[var(--accent)] text-white hover:opacity-90 transition-opacity mb-3"
                      >
                        <Heart size={18} />
                        Donate Now
                      </Link>
                      <p className="text-xs text-center text-[var(--text-muted)]">
                        Every contribution makes a difference
                      </p>
                    </>
                  ) : (
                    <div className="p-4 rounded-xl bg-green-500/10 text-center">
                      <CheckCircle size={32} className="mx-auto text-green-500 mb-2" />
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        This project has been successfully completed!
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Thank you to all who contributed.
                      </p>
                    </div>
                  )}
                </div>

                {/* Share */}
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                  <h3 className="font-semibold text-[var(--text)] mb-4">Share This Project</h3>
                  <div className="flex gap-2">
                    <button className="flex-1 p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors">
                      <Share2 size={18} className="mx-auto" />
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] text-center mt-3">
                    Help spread the word about this project
                  </p>
                </div>

                {/* Other Projects */}
                <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)]">
                  <h3 className="font-semibold text-[var(--text)] mb-4">Support More Projects</h3>
                  <Link
                    href="/projects"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
                  >
                    View All Projects
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
