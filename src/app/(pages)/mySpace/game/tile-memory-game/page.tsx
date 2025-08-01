"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Timer,
  Trophy,
  RotateCcw,
  Play,
  Zap,
  Star,
  Flame,
  Target,
  Clock,
  Award,
  ArrowLeft,
  X,
} from "lucide-react"
import TileIcon from "@/components/ui/tileGame"
import FireIcon from "@/components/ui/fireIcon"
import BadgeIcon from "@/components/ui/badgeIcon"
import TargetIcon from "@/components/ui/targetIcon"
import TimerIcon from "@/components/ui/timerIcon"
import TrophyIcon from "@/components/ui/trophyIcon"
import CurrentSessionIcon from "@/components/ui/currentSessionIcon"
import LeaderboardIcon from "@/components/ui/leaderboardIcon"
import Loader from "@/components/ui/Loader"
import ArrowIcon from "@/components/ui/arrowIcon"
import { LottieSafeWrapper } from "@/components/LottieWrapper"

interface Tile {
  id: number
  imageId: number
  isFlipped: boolean
  isMatched: boolean
  isFlipping: boolean
}

interface LeaderboardEntry {
  name: string
  time: number
  moves: number
  streak: number
  date: string
}

interface TileMemoryGameProps {
  onBack: () => void
  sidebarOpen?: boolean
}

export default function TileMemoryGame({ onBack, sidebarOpen = true }: TileMemoryGameProps) {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [flippedTiles, setFlippedTiles] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [isGameActive, setIsGameActive] = useState(false)
  const [gamePhase, setGamePhase] = useState<"idle" | "preview" | "playing" | "finished">("idle")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerName, setPlayerName] = useState("")
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [showStreakEffect, setShowStreakEffect] = useState(false)
  const [previewCountdown, setPreviewCountdown] = useState(3)
  const [showCelebration, setShowCelebration] = useState(false)

  // Generate unique image patterns for tiles
  const generateTiles = (): Tile[] => {
    const imageIds = Array.from({ length: 18 }, (_, i) => i + 1)
    const pairedIds = [...imageIds, ...imageIds]
    const shuffled = pairedIds.sort(() => Math.random() - 0.5)

    return shuffled.map((imageId, index) => ({
      id: index,
      imageId,
      isFlipped: true,
      isMatched: false,
      isFlipping: false,
    }))
  }

  // Load leaderboard from localStorage
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem("adhd-memory-leaderboard")
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard))
    }
  }, [])

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isGameActive && gamePhase === "playing") {
      interval = setInterval(() => {
        setTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isGameActive, gamePhase])

  // Preview countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gamePhase === "preview" && previewCountdown > 0) {
      interval = setInterval(() => {
        setPreviewCountdown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gamePhase, previewCountdown])

  // Initialize game
  const startGame = () => {
    const newTiles = generateTiles()
    setTiles(newTiles)
    setFlippedTiles([])
    setMatchedPairs(0)
    setMoves(0)
    setTime(0)
    setStreak(0)
    setBestStreak(0)
    setIsGameActive(true)
    setGamePhase("preview")
    setShowCompletionDialog(false)
    setPreviewCountdown(3)

    // Show tiles for 3 seconds, then flip them
    setTimeout(() => {
      setTiles((prev) => prev.map((tile) => ({ ...tile, isFlipped: false })))
      setGamePhase("playing")
    }, 3000)
  }

  // Add this function after the startGame function
  const endGame = () => {
    setTiles([])
    setFlippedTiles([])
    setMatchedPairs(0)
    setMoves(0)
    setTime(0)
    setStreak(0)
    setBestStreak(0)
    setIsGameActive(false)
    setGamePhase("idle")
    setShowCompletionDialog(false)
    setPreviewCountdown(3)
    setShowCelebration(false)
  }

  // Handle tile click
  const handleTileClick = (tileId: number) => {
    if (gamePhase !== "playing" || flippedTiles.length >= 2) return

    const tile = tiles.find((t) => t.id === tileId)
    if (!tile || tile.isFlipped || tile.isMatched || tile.isFlipping) return

    const newFlippedTiles = [...flippedTiles, tileId]
    setFlippedTiles(newFlippedTiles)

    // Add flip animation
    setTiles((prev) => prev.map((t) => (t.id === tileId ? { ...t, isFlipped: true, isFlipping: true } : t)))

    // Remove flip animation class after animation completes
    setTimeout(() => {
      setTiles((prev) => prev.map((t) => (t.id === tileId ? { ...t, isFlipping: false } : t)))
    }, 300)

    if (newFlippedTiles.length === 2) {
      setMoves((prev) => prev + 1)

      const [firstId, secondId] = newFlippedTiles
      const firstTile = tiles.find((t) => t.id === firstId)
      const secondTile = tiles.find((t) => t.id === secondId)

      if (firstTile?.imageId === secondTile?.imageId) {
        // Match found - increment streak
        const newStreak = streak + 1
        setStreak(newStreak)
        if (newStreak > bestStreak) {
          setBestStreak(newStreak)
        }

        // Show streak effect for streaks >= 3
        if (newStreak >= 3) {
          setShowStreakEffect(true)
          setTimeout(() => setShowStreakEffect(false), 1000)
        }

        setTimeout(() => {
          setTiles((prev) => prev.map((t) => (t.id === firstId || t.id === secondId ? { ...t, isMatched: true } : t)))
          setFlippedTiles([])
          setMatchedPairs((prev) => prev + 1)
        }, 500)
      } else {
        // No match - reset streak
        setStreak(0)

        // No match - flip back after delay
        setTimeout(() => {
          setTiles((prev) => prev.map((t) => (t.id === firstId || t.id === secondId ? { ...t, isFlipped: false } : t)))
          setFlippedTiles([])
        }, 800)
      }
    }
  }

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === 18 && gamePhase === "playing") {
      setIsGameActive(false)
      setGamePhase("finished")

      // Start celebration animation
      setShowCelebration(true)

      // Show completion dialog after celebration starts
      setTimeout(() => {
        setShowCompletionDialog(true)
      }, 1000)

      // End celebration after 5 seconds
      setTimeout(() => {
        setShowCelebration(false)
      }, 5000)
    }
  }, [matchedPairs, gamePhase])

  // Save score to leaderboard
  const saveScore = () => {
    if (!playerName.trim()) return

    const newEntry: LeaderboardEntry = {
      name: playerName.trim(),
      time,
      moves,
      streak: bestStreak,
      date: new Date().toLocaleDateString(),
    }

    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => a.time - b.time).slice(0, 10)

    setLeaderboard(updatedLeaderboard)
    localStorage.setItem("adhd-memory-leaderboard", JSON.stringify(updatedLeaderboard))
    setShowCompletionDialog(false)
    setPlayerName("")
  }

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  // Generate tile image/pattern
  const getTileImage = (imageId: number) => {
    const tileDesigns = [
      { bg: "bg-red-500", icon: <LottieSafeWrapper src="/tile-photos/honeycomb.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-red-200" },
      { bg: "bg-blue-500", icon: <LottieSafeWrapper src="/tile-photos/clock.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-blue-200" },
      { bg: "bg-green-500", icon: <LottieSafeWrapper src="/tile-photos/home.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-green-200" },
      { bg: "bg-yellow-500", icon: <LottieSafeWrapper src="/tile-photos/gift.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-yellow-200" },
      { bg: "bg-purple-500", icon: <LottieSafeWrapper src="/tile-photos/camera.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-purple-200" },
      { bg: "bg-pink-500", icon: <LottieSafeWrapper src="/tile-photos/globe.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-pink-200" },
      { bg: "bg-indigo-500", icon: <LottieSafeWrapper src="/tile-photos/edit.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-indigo-200" },
      { bg: "bg-orange-500", icon: <LottieSafeWrapper src="/tile-photos/computer.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-orange-200" },
      { bg: "bg-teal-500", icon: <LottieSafeWrapper src="/tile-photos/heart.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-teal-200" },
      { bg: "bg-cyan-500", icon: <LottieSafeWrapper src="/tile-photos/chart.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-cyan-200" },
      { bg: "bg-lime-500", icon: <LottieSafeWrapper src="/tile-photos/star.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-lime-200" },
      { bg: "bg-amber-500", icon: <LottieSafeWrapper src="/tile-photos/photo.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-amber-200" },
      { bg: "bg-emerald-500", icon: <LottieSafeWrapper src="/tile-photos/coin.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-emerald-200" },
      { bg: "bg-violet-500", icon: <LottieSafeWrapper src="/tile-photos/man.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-violet-200" },
      { bg: "bg-rose-500", icon: <LottieSafeWrapper src="/tile-photos/trolley.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-rose-200" },
      { bg: "bg-sky-500", icon: <LottieSafeWrapper src="/tile-photos/eye.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-sky-200" },
      { bg: "bg-slate-500", icon: <LottieSafeWrapper src="/tile-photos/woodpecker.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-slate-200" },
      { bg: "bg-gray-500", icon: <LottieSafeWrapper src="/tile-photos/zoom.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>, shadow: "shadow-gray-200" },
    ]

    const design = tileDesigns[imageId - 1]

    return (
      <div
        className={`w-full h-full ${design.bg} flex items-center justify-center text-2xl font-bold text-white rounded-2xl ${design.shadow} shadow-lg transition-all duration-300 hover:shadow-xl`}
      >
        <span className="drop-shadow-lg">{design.icon}</span>
      </div>
    )
  }

  const getStreakBadgeVariant = (currentStreak: number) => {
    if (currentStreak >= 10) return "default"
    if (currentStreak >= 7) return "destructive"
    if (currentStreak >= 5) return "default"
    if (currentStreak >= 3) return "secondary"
    return "outline"
  }

  const gameProgress = (matchedPairs / 18) * 100

  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      {/* Streak Effect */}
      {showStreakEffect && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <div className="animate-ping text-6xl"><FireIcon/></div>
          <div className="absolute animate-bounce text-4xl font-bold text-primary mt-16">STREAK {streak}!</div>
        </div>
      )}

      {/* Celebration Animation */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {/* Confetti */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`confetti-${i}`}
              className="absolute w-3 h-3 animate-confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-full h-full ${
                  ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-pink-500"][
                    Math.floor(Math.random() * 6)
                  ]
                } rounded-full`}
              />
            </div>
          ))}

          {/* Sparkles */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="absolute text-2xl animate-sparkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              ✨
            </div>
          ))}

          {/* Fireworks */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`firework-${i}`}
              className="absolute text-4xl animate-firework"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              🎆
            </div>
          ))}

          {/* Central celebration text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-celebration-bounce">
              <div className="text-8xl mb-4 animate-celebration-pulse">🎉</div>
              <h2 className="text-4xl md:text-6xl font-bold text-primary mb-2 animate-celebration-pulse">AMAZING!</h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-semibold animate-fade-in">
                You completed the challenge!
              </p>
            </div>
          </div>

          {/* Side celebration emojis */}
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 text-6xl animate-celebration-bounce">
            🏆
          </div>
          <div
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-6xl animate-celebration-bounce"
            style={{ animationDelay: "0.5s" }}
          >
            🎊
          </div>

          {/* Floating achievement badges */}
          <div className="absolute top-20 left-1/4 animate-fade-in-up" style={{ animationDelay: "1s" }}>
            <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-bold shadow-lg">
              🧠 Memory Master!
            </div>
          </div>
          <div className="absolute top-32 right-1/4 animate-fade-in-up" style={{ animationDelay: "1.5s" }}>
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">⚡ Speed Demon!</div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack} className="bg-[#fdedc9] rounded-full shadow-[3px_3px_0px_0px_#d14e99] hover:bg-[#fdedc9] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out">
              <ArrowIcon/>
              Back to Arcade
            </Button>
          </div>
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground flex items-center justify-center relative -left-10  ">
              <TileIcon/>
              TileTango
            </h1>
            <p className="text-muted-foreground text-lg font-medium relative -left-8 top-4">
              The fun way to stay sharp — match, remember, repeat!
            </p>
          </div>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <div className={`grid gap-8 transition-all duration-300 ${sidebarOpen ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}>
          {/* Game Board */}
          <div
            className={`animate-slide-in transition-all duration-300 ${sidebarOpen ? "lg:col-span-3" : "lg:col-span-4"}`}
          >
            <Card className="border shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] rounded-3xl bg-[#fdedc9]">
              <CardHeader className="bg-primary text-[#FFFFFF] rounded-t-3xl bg-[#d04f99]">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                    <div className="relative -top-5 -left-6 w-10 h-10">
                      <TrophyIcon/>
                    </div>
                    Memory Challenge
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 font-medium rounded-full">
                      <TimerIcon/>
                      {formatTime(time)}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1 font-medium rounded-full">
                      <TargetIcon/>
                      {moves} moves
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1 font-medium rounded-full">
                      <BadgeIcon/>
                      {matchedPairs}/18
                    </Badge>
                    <Badge
                      variant={getStreakBadgeVariant(streak)}
                      className={`flex bg-white text-black items-center gap-1 px-3 py-1 font-medium rounded-full ${streak >= 3 ? "animate-pulse" : ""}`}
                    >
                      <FireIcon/>
                      {streak} streak
                    </Badge>
                  </div>
                </div>
                {gamePhase === "playing" && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{Math.round(gameProgress)}%</span>
                    </div>
                    <Progress value={gameProgress} className="h-2 rounded-full" />
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-8">
                {gamePhase === "preview" && tiles.length > 0 && (
                  <div className="text-center mb-6 animate-fade-in">
                    <Badge variant="default" className="text-lg px-6 py-3 animate-pulse font-medium rounded-full">
                      <Star className="w-5 h-5 mr-2" />
                      Memorize the patterns! Starting in {previewCountdown}...
                      <Star className="w-5 h-5 ml-2" />
                    </Badge>
                  </div>
                )}

                {tiles.length === 0 ? (
                  <div className="text-center py-16 animate-fade-in-scale">
                    <div className="mb-8">
                      <div className="w-[220px] relative left-[38%]">
                        <Loader/>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Challenge Your Mind?</h3>
                      <p className="text-muted-foreground font-medium">Test your memory and build amazing streaks!</p>
                    </div>
                    <Button onClick={startGame} size="lg" className="px-8 py-4 text-lg text-black font-semibold rounded-2xl bg-[#8acfd1] shadow-[3px_3px_0px_0px_#d14e99] hover:bg-[#8acfd1] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out">
                      <img src="/play.png" className="w-6 h-6"/>
                      Start New Game
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-6 gap-2 max-w-fit mx-auto">
                      {tiles.map((tile, index) => (
                        <div
                          key={tile.id}
                          className={`aspect-square cursor-pointer w-16 h-16 sm:w-20 sm:h-20 perspective-1000 ${
                            gamePhase === "playing" ? "cursor-pointer" : "cursor-default"
                          } animate-fade-in`}
                          style={{ animationDelay: `${index * 0.05}s` }}
                          onClick={() => handleTileClick(tile.id)}
                        >
                          <div
                            className={`w-full h-full relative preserve-3d transition-transform duration-300 ${
                              tile.isFlipped || tile.isMatched ? "rotate-y-180" : ""
                            } ${tile.isFlipping ? "animate-fast-flip" : ""}`}
                          >
                            {/* Back of tile (hidden state) */}
                            <div className="absolute inset-0 w-full h-full backface-hidden">
                              <div className="w-full h-full rounded-2xl border-2 border-border flex items-center justify-center shadow-lg transition-colors bg-[#8acfd1]">
                                <div className="w-8 h-8 bg-muted-foreground/20 rounded-full"></div>
                              </div>
                            </div>

                            {/* Front of tile (revealed state) */}
                            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                              <div
                                className={`w-full h-full rounded-2xl border-2 transition-all duration-300 ${
                                  tile.isMatched
                                    ? "border-green-500 opacity-90 shadow-lg shadow-green-500/20"
                                    : "border-border shadow-lg"
                                }`}
                              >
                                {getTileImage(tile.imageId)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                      <Button
                        onClick={startGame}
                        variant="outline"
                        className="flex items-center gap-2 font-medium bg-transparent rounded-2xl bg-[#ffffff] shadow-[4px_4px_0px_0px_#333333] hover:bg-[#ffffff] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all duration-200 ease-in-out"
                      >
                        <LottieSafeWrapper src="/reset.json" size={20} autoplay={true} loop={true} fallbackIcon="🔍"/>
                        New Game
                      </Button>
                      {isGameActive && (
                        <Button
                          onClick={endGame}
                          variant="destructive"
                          className="flex items-center gap-2 text-white font-medium rounded-2xl bg-red-400 shadow-[4px_4px_0px_0px_#333333] hover:bg-red-400 hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all duration-200 ease-in-out"
                        >
                          <X className="w-4 h-4" />
                          End Game
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Session Stats */}
            <Card className="border animate-slide-in-right rounded-3xl shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] bg-[#fdedc9]">
              <CardHeader className="bg-primary text-[#ffffff] rounded-t-3xl bg-[#d04f99]">
                <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                  <CurrentSessionIcon/>
                  Current Session
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-medium">Best Streak</span>
                  <Badge variant={getStreakBadgeVariant(bestStreak)} className="font-semibold rounded-full">
                    {bestStreak}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-medium">Current Streak</span>
                  <Badge variant={getStreakBadgeVariant(streak)} className="font-semibold rounded-full">
                    {streak}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground font-medium">Time Elapsed</span>
                  <Badge variant="outline" className="font-mono font-semibold rounded-full">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTime(time)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card
              className="border animate-slide-in-right rounded-3xl shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] bg-[#fdedc9]"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader className="bg-primary text-[#ffffff] rounded-t-3xl bg-[#d04f99]">
                <CardTitle className="flex items-center gap-2 font-semibold">
                  <LeaderboardIcon/>
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {leaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🏆</div>
                    <p className="text-muted-foreground font-medium">Be the first champion!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((entry, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-2xl border transition-all duration-200 ${
                          index === 0
                            ? "border-primary/20 bg-[#f96f70] text-white"
                            : index === 1
                              ? "bg-[#333333] text-white border-secondary"
                              : index === 2
                                ? "bg-[#5b5b5b] text-white border-muted"
                                : "bg-white text-black border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={index === 0 ? "default" : index <= 2 ? "secondary" : "outline"}
                              className="w-8 h-8 bg-[#fdedc9] rounded-full flex items-center justify-center text-sm text-black font-bold p-0"
                            >
                              {index + 1}
                            </Badge>
                            <div>
                              <p className="font-semibold text-sm">{entry.name}</p>
                              <p className="text-xs text-muted-foreground">{entry.date}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm font-mono">{formatTime(entry.time)}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <span>{entry.moves}m</span>
                              <Zap className="w-3 h-3 text-primary" />
                              <span>{entry.streak}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card
              className="border animate-slide-in-right rounded-3xl shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] bg-[#fdedc9]"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader className="bg-primary text-[#ffffff] rounded-t-3xl bg-[#d04f99]">
                <CardTitle className="text-sm font-semibold">How to Play</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 p-4 font-medium">
                <p>🧠 Memorize tile patterns during preview</p>
                <p>🎯 Click tiles to find matching pairs</p>
                <p>🔥 Build streaks for bonus points</p>
                <p>⚡ Complete as fast as possible</p>
                <p>🏆 Compete on the leaderboard!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Game Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-[#fdedc9] text-black">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2 font-bold">
              <LottieSafeWrapper src="/leaderboard.json" size={50} autoplay={true} loop={true} fallbackIcon="🔍"/>
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              You've completed the memory challenge!
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce"><LottieSafeWrapper src="/confetti.json" size={80} autoplay={true} loop={true} fallbackIcon="🔍"/></div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary font-mono">{formatTime(time)}</p>
                <p className="text-xs text-muted-foreground font-medium">Time</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">{moves}</p>
                <p className="text-xs text-muted-foreground font-medium">Moves</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">{bestStreak}</p>
                <p className="text-xs text-muted-foreground font-medium">Best Streak</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="player-name" className="font-medium">
                  Enter your name for the leaderboard
                </Label>
                <Input
                  id="player-name"
                  type="text"
                  placeholder="Your name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && saveScore()}
                  className="font-medium rounded-2xl bg-white"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              onClick={() => setShowCompletionDialog(false)}
              className="flex-1 font-medium rounded-2xl bg-[#ffffff] shadow-[4px_4px_0px_0px_#333333] hover:bg-[#ffffff] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all duration-200 ease-in-out"
            >
              Skip
            </Button>
            <Button onClick={saveScore} className=" text-white flex-1 font-medium rounded-2xl bg-[#cb6999] shadow-[4px_4px_0px_0px_#ffffff] hover:bg-[#cb6999] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all duration-200 ease-in-out" disabled={!playerName.trim()}>
              Save Score
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
