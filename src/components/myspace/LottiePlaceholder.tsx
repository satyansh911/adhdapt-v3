import type React from "react";

interface LottiePlaceholderProps {
  /** Animation name, e.g. "hero-brain-playground". */
  name: string;
  /** Short note about how it should behave once a real asset is dropped in. */
  note?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Labeled dashed placeholder that stands in for a Lottie animation, matching
 * the design's `[Lottie: name]` convention. Swap for <OptimizedLottie src=…/>
 * once a real .json asset is available — it already carries the intended
 * play-once behaviour note.
 */
export function LottiePlaceholder({
  name,
  note,
  className = "",
  style,
}: LottiePlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-[#ED1C24]/50 p-2 text-center ${className}`}
      style={{
        background:
          "repeating-linear-gradient(45deg,rgba(237,28,36,.05),rgba(237,28,36,.05) 7px,transparent 7px,transparent 14px)",
        ...style,
      }}
    >
      <span className="font-mono text-[10px] font-bold tracking-tight text-[#c0398a]">
        [Lottie: {name}]
      </span>
      {note && (
        <span className="max-w-[210px] font-sans text-[9.5px] leading-tight text-[#9a97a3]">
          {note}
        </span>
      )}
    </div>
  );
}

export default LottiePlaceholder;
