"use client";

import { useState } from "react";
import Image from "next/image";
import type { Reward } from "@/lib/types";

const fallbackImages: Record<string, string> = {
  "bamboo whisk": "/reward-thumbnails/bamboo-whisk.png",
  "canvas market tote": "/reward-thumbnails/canvas-market-tote.png"
};

export function RewardImage({
  imageUrl,
  name,
  type
}: {
  imageUrl?: string | null;
  name: string;
  type: Reward["type"];
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const isMerch = type === "merch";
  const fallbackSrc = fallbackImages[name.toLowerCase()];

  if (fallbackSrc && !fallbackFailed) {
    return (
      <Image
        src={fallbackSrc}
        alt=""
        width={80}
        height={80}
        className="h-20 w-20 shrink-0 rounded-sm border border-line-soft object-cover"
        onError={() => setFallbackFailed(true)}
      />
    );
  }

  if (imageUrl && !imageFailed) {
    return (
      <Image
        src={imageUrl}
        alt=""
        width={80}
        height={80}
        unoptimized
        className="h-20 w-20 shrink-0 rounded-sm border border-line-soft object-cover"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-line-soft bg-rice shadow-sm"
      aria-hidden="true"
    >
      <span className="absolute inset-x-3 top-2.5 h-7 rounded-full bg-milk/70" />
      <span className="absolute bottom-3.5 left-4 h-2 w-11 rounded-full bg-matcha-deep/10" />
      {isMerch ? (
        <>
          <span className="absolute left-[26px] top-[23px] h-[36px] w-[28px] rounded-sm border border-matcha-deep/20 bg-milk shadow-sm" />
          <span className="absolute left-[22px] top-[20px] h-[8px] w-[36px] rounded-full border border-matcha-deep/20 bg-sage-wash" />
          <span className="absolute left-[31px] top-[34px] h-[15px] w-[18px] rounded-[5px] bg-matcha-deep/80" />
        </>
      ) : (
        <>
          <span className="absolute left-[23px] top-[27px] h-[30px] w-[34px] rounded-b-[13px] rounded-t-[8px] border border-matcha-deep/20 bg-milk shadow-sm" />
          <span className="absolute left-[27px] top-[23px] h-[8px] w-[26px] rounded-full bg-matcha-deep/90" />
          <span className="absolute left-[55px] top-[36px] h-[15px] w-[9px] rounded-r-full border-2 border-l-0 border-matcha-deep/20" />
        </>
      )}
    </div>
  );
}
