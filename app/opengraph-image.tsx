import { ImageResponse } from 'next/og'
import { OgImageElement } from '@/lib/og-image-element'

export const runtime = 'edge'
export const alt = 'Diversamente — Plataforma Educacional'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(<OgImageElement />, { ...size })
}
