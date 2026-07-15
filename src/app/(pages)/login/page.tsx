import { SignIn } from "@clerk/nextjs";
import Link from "next/link";
import DotField from "@/components/DotField";

export const metadata = { title: "Login · ADHDapt" };
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080808] px-6 py-16 text-[#ececf0]">
      {/* Home-style dot-field backdrop */}
      <div className="absolute inset-0 opacity-60">
        <DotField />
      </div>

      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <Link href="/" aria-label="ADHDapt home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/home/logo.png" alt="ADHDapt" className="mb-6 w-56" />
        </Link>
        <h1 className="text-center font-display text-3xl font-extrabold md:text-4xl">
          Welcome back
        </h1>
        <p className="mb-8 mt-2 text-center text-sm font-medium text-[#a8a5b0]">
          Log in to your calmer system — no shame, no pressure.
        </p>

        <SignIn
          routing="hash"
          signUpUrl="/login#/sign-up"
          forceRedirectUrl="/dashboard"
          appearance={{
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
              card: "bg-[#17171b] border-2 border-white/10 shadow-[6px_6px_0_#ED1C24]",
              headerTitle: "font-extrabold",
              formButtonPrimary:
                "bg-[#ED1C24] hover:bg-[#c8151c] text-white font-extrabold border-2 border-[#111] shadow-[4px_4px_0_#111] normal-case",
              socialButtonsBlockButton: "border-white/15 hover:bg-white/5 text-[#ececf0]",
              footerActionLink: "text-[#ED1C24] hover:text-[#ff5a5f] font-bold",
              formFieldInput: "bg-[#0f0f12] border-white/15",
            },
          }}
        />

        <p className="mt-8 text-center text-xs text-[#8b8892]">
          By continuing you agree to be kind to your brain. 💛
        </p>
      </div>
    </div>
  );
}
