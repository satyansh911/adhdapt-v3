"use client"

import dynamic from "next/dynamic"

const FocusFlowGamePageClient = dynamic(() => import("./FocusFlowGameClient"), {
  ssr: false,
})

export default function FocusFlowGamePage() {
  return <FocusFlowGamePageClient />
}
