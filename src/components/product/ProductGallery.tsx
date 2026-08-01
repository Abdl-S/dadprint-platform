'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ZoomIn, X, PlayCircle } from 'lucide-react';

export function ProductGallery({ images, videoUrl, alt }: { images: string[]; videoUrl?: string; alt: string }) {
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-ink-8">
        {showVideo && videoUrl ? (
          <video src={videoUrl} controls autoPlay className="h-full w-full object-cover" />
        ) : (
          <Image src={images[active]} alt={alt} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        )}
        <button
          onClick={() => setZoomed(true)}
          aria-label="Zoom"
          className="absolute bottom-3 end-3 flex h-10 w-10 items-center justify-center rounded-full bg-paper shadow-md"
        >
          <ZoomIn size={18} />
        </button>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setShowVideo(false); }}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-sm border-2 ${!showVideo && active === i ? 'border-ink' : 'border-transparent'}`}
          >
            <Image src={img} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
        {videoUrl && (
          <button
            onClick={() => setShowVideo(true)}
            className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-sm border-2 bg-ink-8 ${showVideo ? 'border-ink' : 'border-transparent'}`}
          >
            <PlayCircle size={22} />
          </button>
        )}
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-6"
          onClick={() => setZoomed(false)}
        >
          <button className="absolute end-6 top-6 text-paper" aria-label="Fermer">
            <X size={28} />
          </button>
          <img src={images[active]} alt={alt} className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </div>
  );
}
