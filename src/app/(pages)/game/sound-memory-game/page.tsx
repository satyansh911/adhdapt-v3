"use client"

import dynamic from "next/dynamic"

const SoundMemoryGamePageClient = dynamic(() => import("./SoundMemoryGameClient"), {
  ssr: false,
})

export default function SoundMemoryGamePage() {
  return <SoundMemoryGamePageClient />
}
