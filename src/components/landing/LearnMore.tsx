import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import BorderGlow from "@/components/BorderGlow";

const ARTICLES = [
  { org: "NIMH", title: "What is ADHD?", href: "https://www.nimh.nih.gov/health/topics/attention-deficit-hyperactivity-disorder-adhd", color: "#5b6b8c" },
  { org: "CHADD", title: "ADHD Overview", href: "https://chadd.org/about-adhd/overview/", color: "#2D8EFF" },
  { org: "ADDitude", title: "Understanding ADHD", href: "https://www.additudemag.com/what-is-adhd-symptoms-causes-treatments/", color: "#ED1C24" },
  { org: "Understood", title: "ADHD Basics", href: "https://www.understood.org/en/articles/understanding-adhd", color: "#0d5b5e" },
];

export default function LearnMore() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        {/* Articles */}
        <div>
          <h2 className="font-display text-4xl font-extrabold">Learn More About ADHD</h2>
          <p className="mt-3 max-w-md text-[15px] font-medium text-[#a8a5b0]">
            Explore trusted resources and expert insights to better understand this neurodevelopmental condition.
          </p>
          <h3 className="mt-8 text-[12px] font-bold uppercase tracking-[0.14em] text-[#8b8892]">
            Featured articles
          </h3>
          <div className="mt-4 flex flex-col divide-y divide-white/8">
            {ARTICLES.map((a) => (
              <a
                key={a.org}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 py-4"
              >
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: a.color }}>{a.org}</div>
                  <div className="mt-0.5 text-lg font-extrabold group-hover:text-[#ED1C24]">{a.title}</div>
                </div>
                <span
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ background: a.color }}
                >
                  <ExternalLink className="h-4 w-4" />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Ready to start your healing */}
        <BorderGlow
          colors={["#ED1C24", "#FFC107", "#ff5a5f"]}
          backgroundColor="#17171b"
          glowIntensity={1.4}
          className="cursor-pointer rounded-3xl transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex flex-col items-center p-8 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/home/healing.gif" alt="Healing" className="h-28 w-28 object-contain" />
            <h3 className="mt-5 font-display text-3xl font-extrabold">Ready to start your healing?</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#a8a5b0]">
              No pressure, no shame, no wall of red badges. Just gentle tools that meet your brain where it is.
            </p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl border-2 border-[#111] bg-[#ED1C24] px-7 py-3.5 text-[15px] font-extrabold text-white shadow-[4px_4px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
            >
              Login <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </BorderGlow>
      </div>
    </section>
  );
}
