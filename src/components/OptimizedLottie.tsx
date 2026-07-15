"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

/**
 * Lazy-loaded Lottie player. `next/dynamic` with `ssr: false` keeps the
 * ~150KB lottie-web renderer out of the initial page bundle — it is only
 * fetched on the client, after hydration, when a Lottie is actually rendered.
 */
const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((m) => m.Player),
  { ssr: false }
);

/**
 * Module-level cache of parsed animation JSON keyed by src URL. Ensures each
 * animation file is fetched and JSON-parsed exactly once for the lifetime of
 * the page, no matter how many players (or re-renders) reference it.
 */
const animationCache = new Map<string, unknown>();
const inflight = new Map<string, Promise<unknown>>();

function useLottieData(src: string | object): unknown {
  const [data, setData] = useState<unknown>(() =>
    typeof src === "string" ? animationCache.get(src) ?? null : src
  );

  useEffect(() => {
    if (typeof src !== "string") {
      setData(src);
      return;
    }
    const cached = animationCache.get(src);
    if (cached) {
      setData(cached);
      return;
    }
    let active = true;
    let promise = inflight.get(src);
    if (!promise) {
      promise = fetch(src)
        .then((r) => r.json())
        .then((json) => {
          animationCache.set(src, json);
          inflight.delete(src);
          return json;
        });
      inflight.set(src, promise);
    }
    promise.then((json) => active && setData(json)).catch(() => {});
    return () => {
      active = false;
    };
  }, [src]);

  return data;
}

export interface OptimizedLottieProps {
  /** URL to a public .json animation, or an already-parsed animation object. */
  src: string | object;
  size?: number;
  /**
   * `true` = the animation is the current active focus point (e.g. a running
   * timer) and should loop continuously while on screen. `false` (default) =
   * decorative/feedback animation: it plays once on first appearance and then
   * freezes on its last frame.
   */
  active?: boolean;
  className?: string;
  style?: React.CSSProperties;
  fallback?: React.ReactNode;
}

/**
 * Performance-conscious Lottie wrapper:
 *  - lazy-loaded renderer (see `Player` above)
 *  - shared/memoized animation JSON (see `useLottieData`)
 *  - IntersectionObserver: off-screen players never animate
 *  - play-once-and-freeze unless `active` (which loops)
 */
const OptimizedLottie: React.FC<OptimizedLottieProps> = ({
  src,
  size = 40,
  active = false,
  className = "",
  style,
  fallback = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // lottie-web AnimationItem instance (has play/pause/stop/goToAndStop).
  const instanceRef = useRef<{ play: () => void; pause: () => void } | null>(
    null
  );
  const hasPlayedRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const data = useLottieData(src);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const inst = instanceRef.current;
    if (!inst) return;
    if (visible) {
      // Decorative animations only auto-play once; active ones resume on
      // re-entering the viewport.
      if (active || !hasPlayedRef.current) {
        inst.play();
        hasPlayedRef.current = true;
      }
    } else if (active) {
      inst.pause();
    }
  }, [visible, active, data]);

  const dims: React.CSSProperties = { height: size, width: size, ...style };

  if (!data) {
    return (
      <div ref={containerRef} style={dims} className={className}>
        {fallback}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ display: "inline-block", lineHeight: 0 }}
    >
      <Player
        lottieRef={(inst: { play: () => void; pause: () => void }) => {
          instanceRef.current = inst;
        }}
        autoplay={false}
        loop={active}
        keepLastFrame={!active}
        src={data as object}
        style={dims}
      />
    </div>
  );
};

export default OptimizedLottie;
