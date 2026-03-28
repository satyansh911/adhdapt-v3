import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "700", "900"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "ADHDapt | Focus Fest",
  description: "A vibrant, high-energy cognitive toolkit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const appShell = (
    <html lang="en">
      <body
        className={`${outfit.variable} ${playfair.variable} font-sans antialiased selection:bg-[#E91E63] selection:text-white`}
      >
        {children}
      </body>
    </html>
  );

  if (!clerkPublishableKey) {
    return appShell;
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      {appShell}
    </ClerkProvider>
  );
}
