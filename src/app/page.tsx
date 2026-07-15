import LandingMenu from "@/components/landing/LandingMenu";
import Hero from "@/components/landing/Hero";
import ProblemCards from "@/components/landing/ProblemCards";
import ModuleCarousel from "@/components/landing/ModuleCarousel";
import BrainSection from "@/components/landing/BrainSection";
import AdhdWorldMap from "@/components/landing/AdhdWorldMap";
import LearnMore from "@/components/landing/LearnMore";
import SiteFooter from "@/components/landing/SiteFooter";
import Reveal from "@/components/landing/Reveal";

export const metadata = {
  title: "ADHDapt — the calmer system",
  description: "Turn overwhelm into a playful, low-pressure playground built for the ADHD brain.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-[#080808] text-[#ececf0]">
      <LandingMenu />
      <Hero />
      <Reveal>
        <ProblemCards />
      </Reveal>
      <Reveal>
        <ModuleCarousel />
      </Reveal>
      <Reveal>
        <BrainSection />
      </Reveal>
      <Reveal>
        <AdhdWorldMap />
      </Reveal>
      <Reveal>
        <LearnMore />
      </Reveal>
      <Reveal>
        <SiteFooter />
      </Reveal>
    </div>
  );
}
