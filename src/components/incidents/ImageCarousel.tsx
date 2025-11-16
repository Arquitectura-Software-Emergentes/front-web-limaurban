"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildPhotoUrl } from "@/lib/supabase/storage";

interface ImageCarouselProps {
  photoUrl: string | null;
  yoloResultUrl: string | null;
  altText?: string;
}

export default function ImageCarousel({
  photoUrl,
  yoloResultUrl,
  altText = "Imagen del incidente",
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const originalPhotoUrl = buildPhotoUrl(photoUrl);

  const yoloAnnotatedUrl = yoloResultUrl;

  const images = [
    originalPhotoUrl ? { url: originalPhotoUrl, label: "Foto Original" } : null,
    yoloAnnotatedUrl
      ? { url: yoloAnnotatedUrl, label: "Detección YOLO" }
      : null,
  ].filter(Boolean) as { url: string; label: string }[];

  if (images.length === 0) {
    return (
      <div className="w-full h-64 sm:h-80 bg-[#1A1E29] border-2 border-dashed border-[#345473] rounded-lg flex items-center justify-center">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-[#345473] mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-[#6B7280] text-sm">Sin imagen</p>
        </div>
      </div>
    );
  }

  // If only one image, show it without carousel controls
  if (images.length === 1) {
    return (
      <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden">
        <Image
          src={images[0].url}
          alt={altText}
          fill
          sizes="(max-width: 768px) 100vw, 800px"
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white text-sm font-medium">{images[0].label}</p>
        </div>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden group">
      {/* Current Image */}
      <Image
        src={images[currentIndex].url}
        alt={`${altText} - ${images[currentIndex].label}`}
        fill
        sizes="(max-width: 768px) 100vw, 800px"
        className="object-cover transition-opacity duration-300"
        priority={currentIndex === 0}
      />

      {/* Image Label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white text-sm font-medium">
            {images[currentIndex].label}
          </p>
          <p className="text-white/70 text-xs">
            {currentIndex + 1} / {images.length}
          </p>
        </div>

        {/* Indicators - Inside label area */}
        <div className="flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-200 shadow-md ${
                index === currentIndex
                  ? "bg-[#00C48E] w-8"
                  : "bg-white/70 hover:bg-white w-2"
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Always visible */}
      <button
        onClick={handlePrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#00C48E] to-[#00A076] hover:from-[#00A076] hover:to-[#008060] text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
        aria-label="Imagen anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#00C48E] to-[#00A076] hover:from-[#00A076] hover:to-[#008060] text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-10"
        aria-label="Siguiente imagen"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* YOLO Badge (only shown when viewing YOLO image) */}
      {images[currentIndex].label === "Detección YOLO" && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-[#00C48E] to-[#00A076] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
          </svg>
          <span>DETECCIÓN IA</span>
        </div>
      )}
    </div>
  );
}
