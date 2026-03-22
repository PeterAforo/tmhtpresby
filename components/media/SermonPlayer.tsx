"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SermonPlayerProps {
  videoUrl?: string | null;
  audioUrl?: string | null;
  youtubeId?: string | null;
  title: string;
  thumbnailUrl?: string | null;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function SermonPlayer({
  videoUrl,
  audioUrl,
  youtubeId,
  title,
  thumbnailUrl,
}: SermonPlayerProps) {
  // ── YouTube embed ───────────────────────────────────────────────
  if (youtubeId) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }

  // ── HTML5 Video/Audio player ────────────────────────────────────
  const mediaUrl = videoUrl || audioUrl;
  const isVideo = !!videoUrl;

  if (!mediaUrl) {
    return (
      <div className="w-full aspect-video rounded-xl bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
        <p className="text-[var(--text-muted)] text-sm">
          No media available for this sermon.
        </p>
      </div>
    );
  }

  return <HTML5Player url={mediaUrl} isVideo={isVideo} title={title} />;
}

// ── HTML5 Player (separate component to use hooks) ────────────────
function HTML5Player({
  url,
  isVideo,
  title,
}: {
  url: string;
  isVideo: boolean;
  title: string;
}) {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const onTimeUpdate = () => setCurrentTime(media.currentTime);
    const onLoadedMetadata = () => setDuration(media.duration);
    const onEnded = () => setPlaying(false);

    media.addEventListener("timeupdate", onTimeUpdate);
    media.addEventListener("loadedmetadata", onLoadedMetadata);
    media.addEventListener("ended", onEnded);

    return () => {
      media.removeEventListener("timeupdate", onTimeUpdate);
      media.removeEventListener("loadedmetadata", onLoadedMetadata);
      media.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    if (playing) {
      media.pause();
    } else {
      media.play();
    }
    setPlaying(!playing);
  }, [playing]);

  const toggleMute = useCallback(() => {
    const media = mediaRef.current;
    if (!media) return;
    media.muted = !muted;
    setMuted(!muted);
  }, [muted]);

  const seek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const media = mediaRef.current;
      const bar = progressRef.current;
      if (!media || !bar || !duration) return;
      const rect = bar.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      media.currentTime = pct * duration;
    },
    [duration]
  );

  const skip = useCallback(
    (seconds: number) => {
      const media = mediaRef.current;
      if (!media) return;
      media.currentTime = Math.max(0, Math.min(duration, media.currentTime + seconds));
    },
    [duration]
  );

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full rounded-xl overflow-hidden bg-black">
      {/* Video / Audio element */}
      {isVideo ? (
        <video
          ref={mediaRef as React.RefObject<HTMLVideoElement>}
          src={url}
          className="w-full aspect-video object-contain bg-black"
          playsInline
          onClick={togglePlay}
        />
      ) : (
        <div className="aspect-video bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/10 flex items-center justify-center">
          <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={url} />
          <div
            className="w-24 h-24 rounded-full bg-[var(--accent)]/20 flex items-center justify-center cursor-pointer hover:bg-[var(--accent)]/30 transition-colors"
            onClick={togglePlay}
          >
            {playing ? (
              <Pause size={40} className="text-[var(--accent)]" />
            ) : (
              <Play size={40} className="text-[var(--accent)] ml-1" />
            )}
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="px-4 py-3 bg-[#111] space-y-2">
        {/* Progress bar */}
        <div
          ref={progressRef}
          className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer group"
          onClick={seek}
        >
          <div
            className="h-full bg-[var(--accent)] rounded-full relative transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Button row */}
        <div className="flex items-center gap-3">
          <button onClick={() => skip(-15)} className="text-white/70 hover:text-white transition-colors" title="Back 15s">
            <SkipBack size={18} />
          </button>
          <button onClick={togglePlay} className="text-white hover:text-[var(--accent)] transition-colors" title={playing ? "Pause" : "Play"}>
            {playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>
          <button onClick={() => skip(15)} className="text-white/70 hover:text-white transition-colors" title="Forward 15s">
            <SkipForward size={18} />
          </button>

          {/* Time */}
          <span className="text-xs text-white/60 font-mono ml-1">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Volume */}
          <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors" title={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>

          {/* Fullscreen (video only) */}
          {isVideo && (
            <button
              onClick={() => {
                const el = mediaRef.current;
                if (el && "requestFullscreen" in el) {
                  (el as HTMLVideoElement).requestFullscreen();
                }
              }}
              className="text-white/70 hover:text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
