"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Menu, Timer, Users, ArrowLeft } from "lucide-react";

const TileMemoryGame = dynamic(
  () => import("./tile-memory-game/TileMemoryGameClient").then((m) => m.TileMemoryGame),
  { ssr: false }
);
const FocusFlowGame = dynamic(
  () => import("./focus-flow-game/FocusFlowGameClient").then((m) => m.FocusFlowGame),
  { ssr: false }
);
const SoundMemoryGame = dynamic(
  () => import("./sound-memory-game/SoundMemoryGameClient").then((m) => m.SoundMemoryGame),
  { ssr: false }
);

type GameType = "welcome" | "tile-memory" | "focus-flow" | "sound-memory";

interface Game {
  id: GameType;
  name: string;
  description: string;
  img: string;
  color: string;
  difficulty: string;
  players: string;
}

const GAMES: Game[] = [
  { id: "tile-memory", name: "TileTango", description: "Match tiles & boost your memory", img: "/arcade/tiletango.png", color: "#ED1C24", difficulty: "Medium", players: "Single Player" },
  { id: "focus-flow", name: "SpellBound", description: "Attention-training exercises", img: "/arcade/spellbound.png", color: "#2D8EFF", difficulty: "Easy", players: "Single Player" },
  { id: "sound-memory", name: "EchoCritters", description: "Sound memory game", img: "/arcade/echocritters.png", color: "#0d9488", difficulty: "Medium", players: "Single Player" },
];

const STATS = [
  { img: "/arcade/games%20available.png", value: "3", label: "Games Available" },
  { img: "/arcade/skills.png", value: "∞", label: "Skill Building" },
  { img: "/arcade/fun.png", value: "Fun", label: "Learning Style" },
];

const FEATURES = [
  { img: "/arcade/science-based.png", title: "Science-Based", text: "Designed with cognitive-science principles to effectively train attention and memory." },
  { img: "/arcade/engaging%20and%20fun.png", title: "Engaging & Fun", text: "Colorful, interactive games that make brain training enjoyable and motivating." },
];

function WelcomePage({ onPlay }: { onPlay: (id: GameType) => void }) {
  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/arcade/logo.svg" alt="ADHDapt Arcade" className="mx-auto mb-5 h-24 w-24 object-contain" />
        <h1 className="font-display text-5xl font-extrabold md:text-6xl">Focus Fest</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg font-medium leading-relaxed text-[#a8a5b0]">
          Your personal brain-training arcade. Pick a game built to boost attention, memory, and cognitive skills — playful, never pressured.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-12 grid gap-5 sm:grid-cols-3">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-3xl border border-white/10 bg-[#17171b] p-6 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.img} alt="" className="mx-auto h-10 w-10 object-contain" />
            <h3 className="mt-3 text-2xl font-[900] text-[#ececf0]">{s.value}</h3>
            <p className="mt-1 text-sm font-semibold text-[#8b8892]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Game selection */}
      <h2 className="mb-8 text-center font-display text-3xl font-extrabold">Choose your challenge</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => onPlay(game.id)}
            className="group overflow-hidden rounded-3xl border-2 border-[#111] bg-[#17171b] text-left shadow-[5px_5px_0_#ED1C24] transition-transform hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
          >
            <div className="relative flex items-center gap-3 px-5 py-4" style={{ background: game.color }}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={game.img} alt="" className="h-7 w-7 object-contain" />
              </span>
              <span className="text-xl font-extrabold text-white">{game.name}</span>
            </div>
            <div className="p-5">
              <p className="mb-4 text-sm font-medium text-[#a8a5b0]">{game.description}</p>
              <div className="mb-4 flex items-center justify-between text-[13px] text-[#8b8892]">
                <span className="flex items-center gap-1.5"><Timer className="h-4 w-4" /> {game.difficulty}</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {game.players}</span>
              </div>
              <span className="block rounded-2xl bg-[#ED1C24] py-2.5 text-center text-sm font-extrabold text-white transition-colors group-hover:bg-[#c8151c]">
                Play now
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Features */}
      <h2 className="mb-8 mt-16 text-center font-display text-3xl font-extrabold">Why ADHDapt?</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        {FEATURES.map((f) => (
          <div key={f.title} className="rounded-3xl border border-white/10 bg-[#17171b] p-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ED1C24]/15">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.img} alt="" className="h-8 w-8 object-contain" />
            </div>
            <h3 className="mb-2 text-xl font-extrabold">{f.title}</h3>
            <p className="text-sm leading-relaxed text-[#a8a5b0]">{f.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GameHub() {
  const [currentGame, setCurrentGame] = useState<GameType>("welcome");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 2200);
    return () => clearTimeout(t);
  }, []);

  const renderCurrentGame = () => {
    switch (currentGame) {
      case "tile-memory":
        return <TileMemoryGame onBack={() => setCurrentGame("welcome")} sidebarOpen={sidebarOpen} />;
      case "focus-flow":
        return <FocusFlowGame onBack={() => setCurrentGame("welcome")} sidebarOpen={sidebarOpen} />;
      case "sound-memory":
        return <SoundMemoryGame onBack={() => setCurrentGame("welcome")} sidebarOpen={sidebarOpen} />;
      default:
        return <WelcomePage onPlay={setCurrentGame} />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#080808] text-[#ececf0]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/arcade/loading.svg" alt="Loading" className="h-48 w-48 object-contain" />
        <h2 className="mt-5 font-display text-2xl font-extrabold">Entering the arcade…</h2>
        <p className="mt-1 text-sm font-medium text-[#8b8892]">Preparing your brain-training experience…</p>
        <div className="mt-6 h-1 w-40 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 animate-[loadbar_1.1s_ease-in-out_infinite] rounded-full bg-[#ED1C24]" />
        </div>
        <style>{`@keyframes loadbar{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}}`}</style>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#080808] text-[#ececf0]">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? "w-64" : "w-16"} flex flex-shrink-0 flex-col border-r border-white/10 bg-[#141414] transition-all duration-300`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 p-3">
          {sidebarOpen && (
            <Link href="/dashboard" className="flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/home/logo.png" alt="ADHDapt" className="h-8 w-auto" />
            </Link>
          )}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[#c98fb0] hover:bg-white/5"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 p-3">
          <button
            onClick={() => setCurrentGame("welcome")}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold ${
              currentGame === "welcome" ? "bg-[#ED1C24] text-white" : "text-[#c98fb0] hover:bg-white/5"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/home/home.png" alt="" className="h-[18px] w-[18px] flex-shrink-0 object-contain" />
            {sidebarOpen && "Arcade Home"}
          </button>

          {sidebarOpen && (
            <p className="px-3 pb-1 pt-4 text-[10px] font-bold uppercase tracking-wider text-[#8b8892]">Games</p>
          )}
          {GAMES.map((game) => (
            <button
              key={game.id}
              onClick={() => setCurrentGame(game.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold ${
                currentGame === game.id ? "bg-[#ED1C24] text-white" : "text-[#c98fb0] hover:bg-white/5"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={game.img} alt="" className="h-[18px] w-[18px] flex-shrink-0 object-contain" />
              {sidebarOpen && game.name}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-[#8b8892] hover:bg-white/5"
          >
            <ArrowLeft className="h-[18px] w-[18px] flex-shrink-0" />
            {sidebarOpen && "Back to app"}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">{renderCurrentGame()}</main>
    </div>
  );
}
