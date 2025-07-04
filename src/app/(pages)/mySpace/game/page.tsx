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

type GameType = "welcome" | "tile-memory" | "coming-soon-1" | "coming-soon-2"

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
      description: "Match tiles and boost your memory",
      icon: Grid3X3,
      color: "bg-pink-500",
      available: true,
      difficulty: "Medium",
      players: "Single Player",
    },
    {
      id: "coming-soon-1" as GameType,
      name: "Focus Flow",
      description: "Attention training exercises",
      icon: Target,
      color: "bg-blue-500",
      available: false,
      difficulty: "Easy",
      players: "Single Player",
    },
    {
      id: "coming-soon-2" as GameType,
      name: "Mind Maze",
      description: "Navigate complex puzzles",
      icon: Puzzle,
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
          <Card className="border shadow-lg rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardContent className="p-6 text-center">
              <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-800 dark:text-blue-200">3</h3>
              <p className="text-blue-600 dark:text-blue-300 font-medium">Games Available</p>
            </CardContent>
          </Card>
          <Card className="border shadow-lg rounded-3xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">∞</h3>
              <p className="text-green-600 dark:text-green-300 font-medium">Skill Building</p>
            </CardContent>
          </Card>
          <Card className="border shadow-lg rounded-3xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardContent className="p-6 text-center">
              <Star className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-purple-800 dark:text-purple-200">Fun</h3>
              <p className="text-purple-600 dark:text-purple-300 font-medium">Learning Style</p>
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
                  className={`border shadow-lg rounded-3xl transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer animate-slide-in ${
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
                        <Timer className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{game.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{game.players}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full rounded-2xl font-semibold"
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
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Why ADHDapt Arcade?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Science-Based</h3>
              <p className="text-muted-foreground">
                Games designed with cognitive science principles to effectively train attention and memory skills.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gamepad2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Engaging & Fun</h3>
              <p className="text-muted-foreground">
                Colorful, interactive games that make brain training enjoyable and motivating for all ages.
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
      case "coming-soon-1":
        return <ComingSoonPage gameName="Focus Flow" />
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
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-80" : "w-16"} transition-all duration-300 bg-card border-r border-border flex flex-col animate-slide-in`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-bold text-foreground">ADHDapt</h2>
                  <p className="text-xs text-muted-foreground">Arcade</p>
                </div>
              </div>
            )}
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-full">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <nav className="space-y-2">
            {/* Home */}
            <Button
              variant={currentGame === "welcome" ? "default" : "ghost"}
              className={`w-full justify-start rounded-2xl ${!sidebarOpen ? "px-2" : ""}`}
              onClick={() => setCurrentGame("welcome")}
            >
              <Home className="w-5 h-5" />
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
                  className={`w-full justify-start rounded-2xl ${!sidebarOpen ? "px-2" : ""} ${
                    !game.available ? "opacity-50" : ""
                  }`}
                  onClick={() => game.available && setCurrentGame(game.id)}
                  disabled={!game.available}
                >
                  <IconComponent className="w-5 h-5" />
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
