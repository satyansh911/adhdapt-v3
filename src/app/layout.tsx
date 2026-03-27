import type { Metadata } from "next";
import "./globals.css";


import { ClerkProvider } from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "ADHDapt | Find Your Focus",
  description: "A serene, luxury workspace tailored to quiet the mind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
