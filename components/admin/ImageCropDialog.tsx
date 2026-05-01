'use client'

import { RotateCcw, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

type CropBox = {
  x: number
  y: number
  width: number
  height: number
}

type DragState = {
  mode: 'move' | 'n' | 'e' | 's' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
  startX: number
  startY: number
  startCrop: CropBox
}

const defaultCrop: CropBox = { x: 10, y: 10, width: 80, height: 80 }
const minCropSize = 8

export function ImageCropDialog({
  file,
  title = 'Crop Image',
  onCancel,
  onCrop,
}: {
  file: File
  title?: string
  onCancel: () => void
  onCrop: (file: File) => void
}) {
  const imageRef = useRef<HTMLImageElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const objectUrl = useMemo(() => URL.createObjectURL(file), [file])
  const [crop, setCrop] = useState<CropBox>(defaultCrop)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    setCrop(defaultCrop)
    return () => URL.revokeObjectURL(objectUrl)
  }, [objectUrl])

  useEffect(() => {
    function stopDrag() {
      dragRef.current = null
    }

    function moveCrop(event: PointerEvent) {
      const drag = dragRef.current
      const image = imageRef.current
      if (!drag || !image) return

      const rect = image.getBoundingClientRect()
      const deltaX = ((event.clientX - drag.startX) / rect.width) * 100
      const deltaY = ((event.clientY - drag.startY) / rect.height) * 100
      setCrop(nextCrop(drag.startCrop, drag.mode, deltaX, deltaY))
    }

    window.addEventListener('pointermove', moveCrop)
    window.addEventListener('pointerup', stopDrag)
    return () => {
      window.removeEventListener('pointermove', moveCrop)
      window.removeEventListener('pointerup', stopDrag)
    }
  }, [])

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onCancel])

  async function createCroppedFile() {
    const image = imageRef.current
    if (!image) return

    setProcessing(true)
    const canvas = document.createElement('canvas')
    const sourceX = Math.round((crop.x / 100) * image.naturalWidth)
    const sourceY = Math.round((crop.y / 100) * image.naturalHeight)
    const sourceWidth = Math.round((crop.width / 100) * image.naturalWidth)
    const sourceHeight = Math.round((crop.height / 100) * image.naturalHeight)
    canvas.width = sourceWidth
    canvas.height = sourceHeight

    const context = canvas.getContext('2d')
    if (!context) {
      setProcessing(false)
      return
    }

    context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, sourceWidth, sourceHeight)

    canvas.toBlob(
      (blob) => {
        setProcessing(false)
        if (!blob) return
        onCrop(new File([blob], croppedName(file.name), { type: file.type, lastModified: Date.now() }))
      },
      file.type,
      0.92
    )
  }

  function startDrag(mode: DragState['mode'], event: React.PointerEvent) {
    event.preventDefault()
    event.stopPropagation()
    dragRef.current = {
      mode,
      startX: event.clientX,
      startY: event.clientY,
      startCrop: crop,
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-5xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
          <h2 className="text-base font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onCancel}
            className="focus-ring inline-flex min-h-10 min-w-10 items-center justify-center border border-[var(--border)] transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
            aria-label="Close cropper"
          >
            <X aria-hidden="true" size={16} />
          </button>
        </div>

        <div className="p-4">
          <div className="flex max-h-[70vh] min-h-[320px] items-center justify-center overflow-hidden bg-slate-950">
            <div className="relative inline-block max-h-[70vh] max-w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img ref={imageRef} src={objectUrl} alt="" className="max-h-[70vh] max-w-full select-none object-contain" />
              <div
                className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.48)]"
                style={cropStyle(crop)}
                onPointerDown={(event) => startDrag('move', event)}
              >
                <span className="absolute left-1/3 top-0 h-full w-px bg-white/60" />
                <span className="absolute left-2/3 top-0 h-full w-px bg-white/60" />
                <span className="absolute left-0 top-1/3 h-px w-full bg-white/60" />
                <span className="absolute left-0 top-2/3 h-px w-full bg-white/60" />
                {(['nw', 'ne', 'sw', 'se'] as const).map((handle) => (
                  <button
                    key={handle}
                    type="button"
                    onPointerDown={(event) => startDrag(handle, event)}
                    className={`absolute h-5 w-5 border-2 border-white bg-black/40 ${handleClass(handle)}`}
                    aria-label={`Resize crop ${handle}`}
                  />
                ))}
                {(['n', 'e', 's', 'w'] as const).map((handle) => (
                  <button
                    key={handle}
                    type="button"
                    onPointerDown={(event) => startDrag(handle, event)}
                    className={`absolute bg-white/90 ${edgeHandleClass(handle)}`}
                    aria-label={`Resize crop ${handle}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setCrop(defaultCrop)}
              className="focus-ring inline-flex min-h-11 items-center justify-center gap-2 border border-[var(--border)] px-4 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
            >
              <RotateCcw aria-hidden="true" size={16} />
              Reset
            </button>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onCancel}
                className="focus-ring inline-flex min-h-11 items-center justify-center border border-[var(--border)] px-4 text-sm font-semibold transition-all duration-150 ease-in-out hover:border-slate-500 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processing}
                onClick={() => void createCroppedFile()}
                className="focus-ring inline-flex min-h-11 items-center justify-center border border-[var(--foreground)] bg-[var(--foreground)] px-5 text-sm font-semibold text-[var(--background)] transition-all duration-150 ease-in-out hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing ? 'Cropping...' : 'Use Crop'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function nextCrop(crop: CropBox, mode: DragState['mode'], deltaX: number, deltaY: number): CropBox {
  let { x, y, width, height } = crop

  if (mode === 'move') {
    x = clamp(crop.x + deltaX, 0, 100 - crop.width)
    y = clamp(crop.y + deltaY, 0, 100 - crop.height)
    return { x, y, width, height }
  }

  if (mode.includes('w')) {
    const nextX = clamp(crop.x + deltaX, 0, crop.x + crop.width - minCropSize)
    width = crop.width + crop.x - nextX
    x = nextX
  }
  if (mode.includes('e')) {
    width = clamp(crop.width + deltaX, minCropSize, 100 - crop.x)
  }
  if (mode.includes('n')) {
    const nextY = clamp(crop.y + deltaY, 0, crop.y + crop.height - minCropSize)
    height = crop.height + crop.y - nextY
    y = nextY
  }
  if (mode.includes('s')) {
    height = clamp(crop.height + deltaY, minCropSize, 100 - crop.y)
  }

  return { x, y, width, height }
}

function cropStyle(crop: CropBox) {
  return {
    left: `${crop.x}%`,
    top: `${crop.y}%`,
    width: `${crop.width}%`,
    height: `${crop.height}%`,
  }
}

function handleClass(handle: 'nw' | 'ne' | 'sw' | 'se') {
  const classes = {
    nw: '-left-2.5 -top-2.5 cursor-nwse-resize',
    ne: '-right-2.5 -top-2.5 cursor-nesw-resize',
    sw: '-bottom-2.5 -left-2.5 cursor-nesw-resize',
    se: '-bottom-2.5 -right-2.5 cursor-nwse-resize',
  }
  return classes[handle]
}

function edgeHandleClass(handle: 'n' | 'e' | 's' | 'w') {
  const classes = {
    n: '-top-1 left-1/2 h-2 w-12 -translate-x-1/2 cursor-ns-resize',
    e: '-right-1 top-1/2 h-12 w-2 -translate-y-1/2 cursor-ew-resize',
    s: '-bottom-1 left-1/2 h-2 w-12 -translate-x-1/2 cursor-ns-resize',
    w: '-left-1 top-1/2 h-12 w-2 -translate-y-1/2 cursor-ew-resize',
  }
  return classes[handle]
}

function croppedName(fileName: string) {
  const dotIndex = fileName.lastIndexOf('.')
  if (dotIndex <= 0) return `${fileName}-cropped`
  return `${fileName.slice(0, dotIndex)}-cropped${fileName.slice(dotIndex)}`
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}
