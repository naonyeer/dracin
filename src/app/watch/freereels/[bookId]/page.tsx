"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useFreeReelsDetail, useFreeReelsEpisodeStream } from "@/hooks/useFreeReels";
import { ChevronLeft, ChevronRight, Loader2, List, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Hls from "hls.js";

export default function FreeReelsWatchPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookId = params.bookId as string;

  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [showEpisodeList, setShowEpisodeList] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const { data, isLoading, error } = useFreeReelsDetail(bookId);

  useEffect(() => {
    const epParam = searchParams.get("ep");
    if (!epParam) return;

    const epIndex = parseInt(epParam, 10) - 1;
    if (!isNaN(epIndex) && epIndex >= 0) {
      setCurrentEpisodeIndex(epIndex);
    }
  }, [searchParams]);

  const drama = data?.data;
  const episodes = useMemo(() => drama?.episodes || [], [drama]);
  const totalEpisodes = episodes.length;
  const currentEpisodeData = useMemo(() => episodes[currentEpisodeIndex] || episodes[0] || null, [episodes, currentEpisodeIndex]);

  const {
    data: streamData,
    isLoading: isStreamLoading,
  } = useFreeReelsEpisodeStream(bookId, currentEpisodeData?.videoFakeId || currentEpisodeData?.id || "");

  const currentVideoUrl = useMemo(() => {
    return streamData?.proxiedUrl || streamData?.url || "";
  }, [streamData]);

  const proxiedSubtitleUrl = useMemo(() => {
    const subtitleUrl = streamData?.subtitleUrl;
    return subtitleUrl ? `/api/proxy/video?url=${encodeURIComponent(subtitleUrl)}` : "";
  }, [streamData]);

  useEffect(() => {
    if (!currentVideoUrl) return;

    const video = videoRef.current;
    if (!video) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (Hls.isSupported() && currentVideoUrl.includes(".m3u8")) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        maxBufferLength: 10,
        maxMaxBufferLength: 20,
        backBufferLength: 10,
      });

      hlsRef.current = hls;
      hls.loadSource(currentVideoUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => undefined);
      });
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          hls.destroy();
          hlsRef.current = null;
        }
      });
    } else {
      video.src = currentVideoUrl;
      video.play().catch(() => undefined);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [currentVideoUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !proxiedSubtitleUrl) return;

    const existingTracks = Array.from(video.querySelectorAll("track"));
    existingTracks.forEach((track) => video.removeChild(track));

    const track = document.createElement("track");
    track.kind = "subtitles";
    track.label = "Indonesia";
    track.srclang = "id";
    track.default = true;
    track.src = proxiedSubtitleUrl;
    video.appendChild(track);

    return () => {
      if (video.contains(track)) {
        video.removeChild(track);
      }
    };
  }, [proxiedSubtitleUrl]);

  const handleEpisodeChange = (index: number) => {
    if (index === currentEpisodeIndex) return;
    setShowEpisodeList(false);
    router.push(`/watch/freereels/${bookId}?ep=${index + 1}`);
  };

  const handleVideoEnded = () => {
    const nextIndex = currentEpisodeIndex + 1;
    if (nextIndex < totalEpisodes) {
      router.replace(`/watch/freereels/${bookId}?ep=${nextIndex + 1}`);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center space-y-4 bg-black">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium text-white">Memuat video...</h3>
          <p className="text-sm text-white/60">Mohon tunggu sebentar...</p>
        </div>
      </div>
    );
  }

  if (error || !drama) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black p-4">
        <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
        <h2 className="mb-4 text-2xl font-bold text-white">Video tidak ditemukan</h2>
        <Link href="/" className="text-primary hover:underline">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-black">
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-40 h-16">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent" />
        <div className="pointer-events-auto relative z-10 mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          <Link
            href={`/detail/freereels/${bookId}`}
            className="-ml-2 flex items-center gap-2 rounded-full p-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="hidden font-bold text-primary drop-shadow-md sm:inline">pusatdracin</span>
          </Link>

          <div className="min-w-0 flex-1 px-4 text-center">
            <h1 className="truncate text-sm font-medium text-white drop-shadow-md sm:text-base">{drama.title}</h1>
            <p className="text-xs text-white/80 drop-shadow-md">
              {currentEpisodeData ? `Episode ${(currentEpisodeData.index || currentEpisodeIndex) + 1}` : "Episode ?"}
            </p>
          </div>

          <button
            onClick={() => setShowEpisodeList(!showEpisodeList)}
            className="rounded-full p-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
          >
            <List className="h-6 w-6 drop-shadow-md" />
          </button>
        </div>
      </div>

      <div className="relative flex h-full w-full flex-1 flex-col items-center justify-center bg-black">
        <div className="relative flex h-full w-full items-center justify-center">
          {currentVideoUrl ? (
            <video
              ref={videoRef}
              controls
              autoPlay
              className="max-h-[100dvh] h-full w-full object-contain"
              poster={drama.cover}
              onEnded={handleVideoEnded}
              disableRemotePlayback
              crossOrigin="anonymous"
            />
          ) : isStreamLoading ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4">
              <p className="text-white/60">URL video tidak ditemukan</p>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute bottom-20 left-0 right-0 z-40 flex justify-center pb-safe-area-bottom md:bottom-12">
          <div className="pointer-events-auto origin-bottom scale-90 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 shadow-lg backdrop-blur-md transition-all md:scale-100 md:gap-6 md:px-6 md:py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleEpisodeChange(currentEpisodeIndex - 1)}
                disabled={currentEpisodeIndex <= 0}
                className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10 disabled:opacity-30 md:p-2"
              >
                <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
              </button>

              <span className="min-w-[60px] text-center text-xs font-medium tabular-nums text-white md:min-w-[80px] md:text-sm">
                Ep {currentEpisodeData ? (currentEpisodeData.index || currentEpisodeIndex) + 1 : 1} / {totalEpisodes}
              </span>

              <button
                onClick={() => handleEpisodeChange(currentEpisodeIndex + 1)}
                disabled={currentEpisodeIndex >= totalEpisodes - 1}
                className="rounded-full p-1.5 text-white transition-colors hover:bg-white/10 disabled:opacity-30 md:p-2"
              >
                <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEpisodeList && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={() => setShowEpisodeList(false)} />
          <div className="animate-in slide-in-from-right fixed inset-y-0 right-0 z-[70] w-72 overflow-y-auto border-l border-white/10 bg-zinc-900 shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-zinc-900 p-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white">Daftar Episode</h2>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/60">Total {totalEpisodes}</span>
              </div>
              <button onClick={() => setShowEpisodeList(false)} className="p-1 text-white/70 hover:text-white">
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2 p-3">
              {episodes.map((ep: any, idx: number) => (
                <button
                  key={ep.id}
                  onClick={() => handleEpisodeChange(idx)}
                  className={cn(
                    "aspect-square rounded-lg text-sm font-medium transition-all",
                    idx === currentEpisodeIndex
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {(ep.index || idx) + 1}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
