'use client'

import Image from 'next/image'
import { useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

export function LightboxGallery({ title, images }: { title: string; images: string[] }) {
  const [index, setIndex] = useState(-1)

  if (!images.length) return null

  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2">
        {images.map((image, imageIndex) => (
          <button
            key={image}
            type="button"
            onClick={() => setIndex(imageIndex)}
            className="focus-ring relative aspect-[4/3] bg-slate-200 transition-all duration-150 ease-in-out hover:opacity-90 active:scale-[0.99]"
            aria-label={`Open ${title} gallery image ${imageIndex + 1}`}
          >
            <Image
              src={image}
              alt={`${title} gallery image ${imageIndex + 1}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              quality={75}
            />
          </button>
        ))}
      </div>
      <Lightbox
        open={index >= 0}
        close={() => setIndex(-1)}
        index={index}
        slides={images.map((src) => ({ src, alt: title }))}
      />
    </>
  )
}
