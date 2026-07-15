"use client"

import dynamic from "next/dynamic"

const TileMemoryGamePageClient = dynamic(() => import("./TileMemoryGameClient"), {
  ssr: false,
})

export default function TileMemoryGamePage() {
  return <TileMemoryGamePageClient />
}
