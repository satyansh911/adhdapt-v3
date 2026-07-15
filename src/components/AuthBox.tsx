"use client";

import { useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";

const appearance = {
  variables: {
    colorPrimary: "#ED1C24",
    colorBackground: "#17171b",
    colorText: "#ececf0",
    colorTextSecondary: "#a8a5b0",
    colorInputBackground: "#0f0f12",
    colorInputText: "#ececf0",
    colorDanger: "#ff5a5f",
    borderRadius: "0.9rem",
    fontFamily: '"Google Sans", var(--font-outfit), sans-serif',
  },
  elements: {
    rootBox: "w-full",
    card: "bg-[#17171b] border border-white/10 shadow-2xl",
    headerTitle: "font-extrabold",
    formButtonPrimary:
      "bg-[#ED1C24] hover:bg-[#c8151c] text-white font-extrabold normal-case",
    socialButtonsBlockButton: "border-white/15 hover:bg-white/5 text-[#ececf0]",
    formFieldInput: "bg-[#0f0f12] border-white/15",
    // Hide Clerk's own "Don't have an account? Sign up" row — we drive the
    // toggle ourselves so it never leaves the page.
    footerAction: "hidden",
  },
};

export default function AuthBox() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");

  return (
    <div className="w-full">
      {mode === "sign-in" ? (
        <SignIn routing="virtual" forceRedirectUrl="/dashboard" appearance={appearance} />
      ) : (
        <SignUp routing="virtual" forceRedirectUrl="/dashboard" appearance={appearance} />
      )}

      <p className="mt-5 text-center text-sm text-[#a8a5b0]">
        {mode === "sign-in" ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
          className="font-bold text-[#ED1C24] transition-colors hover:text-[#ff5a5f]"
        >
          {mode === "sign-in" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
