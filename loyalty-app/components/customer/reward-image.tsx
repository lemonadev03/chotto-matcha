"use client";

import { useState } from "react";
import Image from "next/image";
import type { Reward } from "@/lib/types";

export function RewardImage({
  imageUrl,
  type
}: {
  imageUrl?: string | null;
  type: Reward["type"];
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const isMerch = type === "merch";

  if (imageUrl && !imageFailed) {
    return (
      <Image
        src={imageUrl}
        alt=""
        width={64}
        height={64}
        unoptimized
        className="h-16 w-16 shrink-0 rounded-sm border border-line-soft object-cover"
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <div
      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-line-soft bg-rice shadow-sm"
      aria-hidden="true"
    >
      <span className="absolute inset-x-2 top-2 h-6 rounded-full bg-milk/70" />
      <span className="absolute bottom-3 left-3.5 h-1.5 w-9 rounded-full bg-matcha-deep/10" />
      {isMerch ? (
        <>
          <span className="absolute left-[20px] top-[17px] h-[32px] w-[25px] rounded-sm border border-matcha-deep/20 bg-milk shadow-sm" />
          <span className="absolute left-[17px] top-[14px] h-[8px] w-[31px] rounded-full border border-matcha-deep/20 bg-sage-wash" />
          <span className="absolute left-[24px] top-[25px] h-[14px] w-[17px] rounded-[5px] bg-matcha-deep/80" />
        </>
      ) : (
        <>
          <span className="absolute left-[16px] top-[20px] h-[25px] w-[30px] rounded-b-[12px] rounded-t-[8px] border border-matcha-deep/20 bg-milk shadow-sm" />
          <span className="absolute left-[19px] top-[17px] h-[8px] w-[24px] rounded-full bg-matcha-deep/90" />
          <span className="absolute left-[44px] top-[26px] h-[13px] w-[9px] rounded-r-full border-2 border-l-0 border-matcha-deep/20" />
        </>
      )}
    </div>
  );
}
