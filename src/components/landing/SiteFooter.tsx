import Link from "next/link";
import Image from "next/image";

const ROLES = [
  ["Individual", "/login"],
  ["Parent", "/parent"],
  ["Therapist", "/therapist"],
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#111]">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-8 text-center">
        <Image src="/home/logo.png" alt="ADHDapt" width={120} height={40} className="h-9 w-auto" />
        <p className="mt-2.5 max-w-sm text-[13px] leading-relaxed text-[#8b8892]">
          The calmer system for the ADHD brain. Tools that reward you, never shame you.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#8b8892]">
            Login as:
          </span>
          {ROLES.map(([label, href], i) => (
            <span key={href} className="flex items-center gap-2">
              <Link
                href={href}
                className="text-sm font-extrabold text-[#c9c7d0] transition-colors hover:text-[#ED1C24]"
              >
                {label}
              </Link>
              {i < ROLES.length - 1 && <span className="text-[#3a3a3a]">·</span>}
            </span>
          ))}
        </div>

        <p className="mt-5 text-xs text-[#8b8892]">© {new Date().getFullYear()} ADHDapt</p>
      </div>
    </footer>
  );
}
