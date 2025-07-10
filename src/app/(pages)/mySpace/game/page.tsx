"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import ThemeToggle from "@/components/theme-toggle"
import { Brain, Gamepad2, Trophy, Star, Zap, Target, Menu, Home, Grid3X3, Puzzle, Timer, Users } from "lucide-react"
import TileMemoryGame from "./tile-memory-game/page"
import GameIcon from "@/components/ui/gamification"
import ArcadeIcon from "@/components/ui/ArcadeIcon"
import TrophyIcon from "@/components/ui/trophyIcon"
import LightningIcon from "@/components/ui/lightningIcon"
import StarIcon from "@/components/ui/starIcon"
import TileIcon from "@/components/ui/tileGame"
import ScienceIcon from "@/components/ui/scienceIcon"
import EngageIcon from "@/components/ui/engagingIcon"
import FocusFlowIcon from "@/components/ui/focusFlowIcon"
import MindMazeIcon from "@/components/ui/mindMazeIcon"
import HomeIcon from "@/components/ui/homeIcon"
import SidebarIcon from "@/components/ui/sidebarLogo"
import TimerIcon from "@/components/ui/timerIcon"
import FocusFlowGame from "./focus-flow-game/page"

type GameType = "welcome" | "tile-memory" | "focus-flow" | "coming-soon-2"

export default function GameHub() {
  const [currentGame, setCurrentGame] = useState<GameType>("welcome")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  // Loading effect - same as your original
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const games = [
    {
      id: "tile-memory" as GameType,
      name: "TileTango",
      description: "Match tiles & boost your memory",
      icon: TileIcon,
      color: "bg-pink-500",
      available: true,
      difficulty: "Medium",
      players: "Single Player",
    },
    {
      id: "focus-flow" as GameType,
      name: "SpellBound",
      description: "Attention training exercises",
      icon: FocusFlowIcon,
      color: "bg-blue-500",
      available: true,
      difficulty: "Easy",
      players: "Single Player",
    },
    {
      id: "coming-soon-2" as GameType,
      name: "Mind Maze",
      description: "Navigate complex puzzles",
      icon: MindMazeIcon,
      color: "bg-green-500",
      available: false,
      difficulty: "Hard",
      players: "Single Player",
    },
  ]

  const WelcomePage = () => (
    <div className="min-h-screen bg-background p-2 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-10 animate-fade-in-up">
            <div className="mb-5">
                <ArcadeIcon/>
                <div className="flex items-center justify-center gap-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-foreground">ADHDapt</h1>
                </div>
                <div className="h-5">
                    <h1 className="font-bold relative tracking-[0.6em] left-[38px] -top-2">ARCA</h1>
                    <h1 className="font-bold tracking-[0.6em] relative left-[117px] -top-8">DE</h1>
                </div>
            </div>
          
          <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
            Welcome to your personal brain training center! Choose from our collection of engaging games designed to
            boost attention, memory, and cognitive skills.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 animate-slide-in">
          <Card className="border rounded-3xl bg-[#fdedc9] shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99]">
            <CardContent className="p-6 text-center">
              <TrophyIcon/>
              <h3 className="text-2xl font-bold text-[#d04f99]">3</h3>
              <p className="text-[#d04f99] font-medium">Games Available</p>
            </CardContent>
          </Card>
          <Card className="border rounded-3xl bg-[#fdedc9] shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99]">
            <CardContent className="p-6 text-center">
              <LightningIcon/>
              <h3 className="text-2xl font-bold text-[#d04f99]">&infin;</h3>
              <p className="text-[#d04f99] font-medium">Skill Building</p>
            </CardContent>
          </Card>
          <Card className="border rounded-3xl bg-[#fdedc9] shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99]">
            <CardContent className="p-6 text-center">
              <StarIcon/>
              <h3 className="text-2xl font-bold text-[#d04f99]">Fun</h3>
              <p className="text-[#d04f99] font-medium">Learning Style</p>
            </CardContent>
          </Card>
        </div>

        {/* Game Selection */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Choose Your Challenge</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => {
              const IconComponent = game.icon
              return (
                <Card
                  key={game.id}
                  className={`border bg-[#fdedc9] shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] rounded-3xl hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out cursor-pointer animate-slide-in ${
                    !game.available ? "opacity-60" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => game.available && setCurrentGame(game.id)}
                >
                  <CardHeader className={`${game.color} text-white rounded-t-3xl relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <IconComponent className="w-8 h-8" />
                        {!game.available && (
                          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                            Coming Soon
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-xl font-bold">{game.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground mb-4 font-medium">{game.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <TimerIcon/>
                        <span className="text-sm text-muted-foreground">{game.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{game.players}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full rounded-2xl font-semibold bg-[#8acfd1] hover:bg-[#ffffff] shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99]"
                      disabled={!game.available}
                      onClick={(e) => {
                        e.stopPropagation()
                        game.available && setCurrentGame(game.id)
                      }}
                    >
                      {game.available ? "Play Now" : "Coming Soon"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="mb-5">
                <div className="flex items-center justify-center gap-4">
                    <h1 className="text-5xl md:text-6xl font-bold text-foreground">Why ADHDapt?</h1>
                </div>
                <div className="h-5">
                    <h1 className="font-bold relative tracking-[0.6em] left-[570px] -top-2">ARCA</h1>
                    <h1 className="font-bold tracking-[0.6em] relative left-[670px] -top-8">DE</h1>
                </div>
            </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ScienceIcon/>
              </div>
              <h3 className="text-xl font-bold mb-2">Science-Based</h3>
              <p className="text-muted-foreground">
                Games designed with cognitive science principles to effectively train attention and memory skills.
              </p>
            </div>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <EngageIcon/>
              </div>
              <h3 className="text-xl font-bold mb-2">Engaging & Fun</h3>
              <p className="text-muted-foreground">
                Colorful, interactive games that make brain training <br/>enjoyable and motivating for all ages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const ComingSoonPage = ({ gameName }: { gameName: string }) => (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="text-center animate-fade-in-scale">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
          🚀
        </div>
        <h2 className="text-3xl font-bold text-foreground mb-4">{gameName}</h2>
        <p className="text-xl text-muted-foreground mb-8">This exciting game is coming soon!</p>
        <Button onClick={() => setCurrentGame("welcome")} className="px-8 py-3 text-lg font-semibold rounded-2xl">
          Back to Arcade
        </Button>
      </div>
    </div>
  )

  const renderCurrentGame = () => {
    switch (currentGame) {
      case "welcome":
        return <WelcomePage />
      case "tile-memory":
        return <TileMemoryGame onBack={() => setCurrentGame("welcome")} sidebarOpen={sidebarOpen} />
      case "focus-flow":
        return <FocusFlowGame onBack={() => setCurrentGame("welcome")} sidebarOpen={sidebarOpen} />
      case "coming-soon-2":
        return <ComingSoonPage gameName="Mind Maze" />
      default:
        return <WelcomePage />
    }
  }

  // Loading screen - same as your original
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in-scale">
          <GameIcon/>
          <h2 className="text-2xl font-bold text-foreground mb-2">Entering the arcade...</h2>
          <p className="text-muted-foreground">Preparing your brain training experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        currentGame === "focus-flow" ? "bg-[#d8eaf8]" : "bg-background"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-80" : "w-16"} transition-all duration-300 border-r border-border flex flex-col animate-slide-in ${
          currentGame === "focus-flow" ? "bg-[#a8d4f9]" : "bg-[#f8d8ea]"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-2 border-b border-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="relative left-4 w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <SidebarIcon/>
                </div>
                <div className="relative left-4 top-2">
                <div className="flex items-center justify-center gap-4">
                    <h1 className="text-lg font-bold text-foreground">ADHDapt</h1>
                </div>
                <div className="h-5">
                    <h1 className="text-[0.5rem] font-bold relative tracking-[0.6em] left-[25px] -top-2">ARCA</h1>
                    <h1 className="text-[0.5rem] font-bold tracking-[0.6em] relative left-[72px] -top-5">DE</h1>
                </div>
            </div>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-full">
              <Menu className="relative left-1 w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {/* Home */}
            <Button
              variant={currentGame === "welcome" ? "default" : "ghost"}
              className={`justify-start rounded-3xl ${!sidebarOpen ? "px-1.5 w-[40px]" : "w-full relative left-2 px-1.5"}`}
              onClick={() => setCurrentGame("welcome")}
            >
              <HomeIcon/>
              {sidebarOpen && <span className="ml-3">Home</span>}
            </Button>

            {/* Games */}
            {sidebarOpen && (
              <div className="pt-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">Games</p>
              </div>
            )}

            {games.map((game) => {
              const IconComponent = game.icon
              return (
                <Button
                  key={game.id}
                  variant={currentGame === game.id ? "default" : "ghost"}
                  className={`w-full justify-start rounded-2xl ${!sidebarOpen ? "px-0" : "px-2"} ${
                    !game.available ? "opacity-50" : ""
                  }`}
                  onClick={() => game.available && setCurrentGame(game.id)}
                  disabled={!game.available}
                >
                  <IconComponent className="relative left-10 w-5 h-5" />
                  {sidebarOpen && (
                    <div className="ml-3 flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <span>{game.name}</span>
                        {!game.available && (
                          <Badge variant="secondary" className="text-xs">
                            Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Theme Toggle */}
        <div className="p-4 border-t border-border">
          <div className={`flex items-center ${sidebarOpen ? "justify-between" : "justify-center"}`}>
            {sidebarOpen && <span className="text-sm text-muted-foreground">Theme</span>}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto transition-all duration-300">{renderCurrentGame()}</div>
    </div>
  )
}
