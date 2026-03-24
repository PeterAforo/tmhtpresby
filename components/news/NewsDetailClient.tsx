"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Link2,
  Check,
  Star,
  MessageCircle,
  ArrowLeft,
  Send,
  User,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author: string;
  category: string;
  imageUrl: string | null;
  likes: number;
  publishedAt: Date;
}

interface RelatedPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string;
  category: string;
  publishedAt: Date;
}

interface Comment {
  id: string;
  content: string;
  authorName: string;
  createdAt: Date;
}

interface NewsDetailClientProps {
  post: Post;
  relatedPosts: RelatedPost[];
  comments: Comment[];
  rating: { average: number; count: number };
  categoryColors: Record<string, string>;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
}

export function NewsDetailClient({
  post,
  relatedPosts,
  comments: initialComments,
  rating: initialRating,
  categoryColors,
}: NewsDetailClientProps) {
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const [rating, setRating] = useState(initialRating);
  const [comments, setComments] = useState(initialComments);
  const [commentForm, setCommentForm] = useState({ name: "", email: "", content: "" });
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);

  const eventUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleLike = async () => {
    if (hasLiked || isLiking) return;
    
    setIsLiking(true);
    try {
      const res = await fetch(`/api/news/${post.slug}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLikes(data.likes);
        setHasLiked(true);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleRating = async (stars: number) => {
    if (hasRated) return;
    
    try {
      const res = await fetch(`/api/news/${post.slug}/rate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: stars }),
      });
      if (res.ok) {
        const data = await res.json();
        setRating({ average: data.average, count: data.count });
        setUserRating(stars);
        setHasRated(true);
      }
    } catch (error) {
      console.error("Error rating post:", error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(eventUrl)}`, "_blank");
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(post.title)}`, "_blank");
  };

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(eventUrl)}`, "_blank");
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.email || !commentForm.content) return;

    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/news/${post.slug}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(commentForm),
      });
      if (res.ok) {
        setCommentForm({ name: "", email: "", content: "" });
        setCommentSuccess(true);
        setTimeout(() => setCommentSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <>
      {/* Action Bar */}
      <div className="bg-[var(--bg-card)] border-b border-[var(--border)] sticky top-16 md:top-20 z-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/news"
              className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
            >
              <ArrowLeft size={16} />
              Back to News
            </Link>

            <div className="flex items-center gap-2">
              {/* Like Button */}
              <button
                onClick={handleLike}
                disabled={hasLiked || isLiking}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                  hasLiked
                    ? "bg-rose-500/10 text-rose-500"
                    : "bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:text-rose-500 hover:border-rose-500/30"
                )}
              >
                <Heart size={18} className={hasLiked ? "fill-current" : ""} />
                <span>{likes > 0 ? likes : "Like"}</span>
              </button>

              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[var(--bg)] border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  <Share2 size={18} />
                  <span className="hidden sm:inline">Share</span>
                </button>

                {showShareMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden">
                    <div className="p-2">
                      <button
                        onClick={shareOnFacebook}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                      >
                        <Facebook size={18} className="text-blue-600" />
                        Share on Facebook
                      </button>
                      <button
                        onClick={shareOnTwitter}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                      >
                        <Twitter size={18} className="text-sky-500" />
                        Share on Twitter
                      </button>
                      <button
                        onClick={shareOnLinkedIn}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                      >
                        <Linkedin size={18} className="text-blue-700" />
                        Share on LinkedIn
                      </button>
                      <hr className="my-2 border-[var(--border)]" />
                      <button
                        onClick={handleCopyLink}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                      >
                        {copied ? (
                          <>
                            <Check size={18} className="text-green-500" />
                            Link Copied!
                          </>
                        ) : (
                          <>
                            <Link2 size={18} />
                            Copy Link
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
      )}

      {/* Main Content */}
      <section className="py-10 lg:py-16 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Article Content */}
          <article className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-[family-name:var(--font-heading)] prose-a:text-[var(--accent)] prose-img:rounded-xl">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Rating Section */}
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text)] mb-1">Rate this article</h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {rating.count > 0
                    ? `${rating.average.toFixed(1)} out of 5 (${rating.count} rating${rating.count !== 1 ? "s" : ""})`
                    : "Be the first to rate this article"}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    disabled={hasRated}
                    className={cn(
                      "p-1 transition-colors",
                      hasRated ? "cursor-default" : "hover:scale-110"
                    )}
                  >
                    <Star
                      size={28}
                      className={cn(
                        "transition-colors",
                        star <= (userRating || Math.round(rating.average))
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300 dark:text-gray-600"
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <h3 className="text-xl font-semibold text-[var(--text)] mb-6 flex items-center gap-2">
              <MessageCircle size={24} />
              Comments ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="mb-8 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
              <h4 className="font-medium text-[var(--text)] mb-4">Leave a comment</h4>
              {commentSuccess && (
                <div className="mb-4 p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-sm">
                  Thank you! Your comment has been submitted and is awaiting moderation.
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                  className="px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
                  required
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={commentForm.email}
                  onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                  className="px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
                  required
                />
              </div>
              <textarea
                placeholder="Write your comment..."
                value={commentForm.content}
                onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 resize-none mb-4"
                required
              />
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="flex items-center gap-2 px-6 py-2.5 bg-[var(--accent)] text-white font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Send size={16} />
                {isSubmittingComment ? "Submitting..." : "Submit Comment"}
              </button>
            </form>

            {/* Comments List */}
            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                        <User size={20} className="text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text)]">{comment.authorName}</p>
                        <p className="text-xs text-[var(--text-muted)]">{formatDate(comment.createdAt)}</p>
                      </div>
                    </div>
                    <p className="text-[var(--text-muted)] leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-[var(--text-muted)] py-8">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 bg-[var(--bg-card)] border-t border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/news/${relatedPost.slug}`}
                  className="group flex flex-col rounded-xl overflow-hidden bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={relatedPost.imageUrl}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-white/90", categoryColors[relatedPost.category]?.split(" ")[1] || "text-gray-600")}>
                        {relatedPost.category.replace("-", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(relatedPost.publishedAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
