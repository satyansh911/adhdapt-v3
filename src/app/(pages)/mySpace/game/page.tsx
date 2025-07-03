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
import { ThemeToggle } from "@/components/theme-toggle"
import { Timer, Trophy, RotateCcw, Play, Zap, Star, Flame, Brain, Target, Clock, Award } from "lucide-react"

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

export default function ADHDMemoryGame() {
  const [tiles, setTiles] = useState<Tile[]>([])
  const [flippedTiles, setFlippedTiles] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [time, setTime] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [isGameActive, setIsGameActive] = useState(false)
  const [gamePhase, setGamePhase] = useState<"preview" | "playing" | "finished">("preview")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerName, setPlayerName] = useState("")
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [showStreakEffect, setShowStreakEffect] = useState(false)
  const [previewCountdown, setPreviewCountdown] = useState(3)
  const [isLoading, setIsLoading] = useState(true)
  const [showCelebration, setShowCelebration] = useState(false)

  // Loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

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
      { bg: "bg-red-500", icon: "🌟", shadow: "shadow-red-200" },
      { bg: "bg-blue-500", icon: "🎯", shadow: "shadow-blue-200" },
      { bg: "bg-green-500", icon: "🎨", shadow: "shadow-green-200" },
      { bg: "bg-yellow-500", icon: "🎪", shadow: "shadow-yellow-200" },
      { bg: "bg-purple-500", icon: "🎭", shadow: "shadow-purple-200" },
      { bg: "bg-pink-500", icon: "🎵", shadow: "shadow-pink-200" },
      { bg: "bg-indigo-500", icon: "🎸", shadow: "shadow-indigo-200" },
      { bg: "bg-orange-500", icon: "🎺", shadow: "shadow-orange-200" },
      { bg: "bg-teal-500", icon: "🎻", shadow: "shadow-teal-200" },
      { bg: "bg-cyan-500", icon: "🎹", shadow: "shadow-cyan-200" },
      { bg: "bg-lime-500", icon: "⭐", shadow: "shadow-lime-200" },
      { bg: "bg-amber-500", icon: "🔥", shadow: "shadow-amber-200" },
      { bg: "bg-emerald-500", icon: "💎", shadow: "shadow-emerald-200" },
      { bg: "bg-violet-500", icon: "🌈", shadow: "shadow-violet-200" },
      { bg: "bg-rose-500", icon: "🚀", shadow: "shadow-rose-200" },
      { bg: "bg-sky-500", icon: "⚡", shadow: "shadow-sky-200" },
      { bg: "bg-slate-500", icon: "🎲", shadow: "shadow-slate-200" },
      { bg: "bg-gray-500", icon: "🎊", shadow: "shadow-gray-200" },
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-fade-in-scale">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
            🧠
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Loading ADHDapt Memory Challenge</h2>
          <p className="text-muted-foreground">Preparing your brain training experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      {/* Streak Effect */}
      {showStreakEffect && (
        <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center">
          <div className="animate-ping text-6xl">🔥</div>
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
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 flex items-center justify-center gap-3">
              <Brain className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              ADHDapt Memory Challenge
            </h1>
            <p className="text-muted-foreground text-lg font-medium">
              Boost your attention and memory skills with this engaging tile matching adventure!
            </p>
          </div>
          <ThemeToggle />
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Game Board */}
          <div className="lg:col-span-3 animate-slide-in">
            <Card className="border shadow-lg rounded-3xl">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-3xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                    <Trophy className="w-6 h-6" />
                    Memory Challenge
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 font-medium rounded-full">
                      <Timer className="w-4 h-4" />
                      {formatTime(time)}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1 font-medium rounded-full">
                      <Target className="w-4 h-4 mr-1" />
                      {moves} moves
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1 font-medium rounded-full">
                      <Award className="w-4 h-4 mr-1" />
                      {matchedPairs}/18
                    </Badge>
                    <Badge
                      variant={getStreakBadgeVariant(streak)}
                      className={`flex items-center gap-1 px-3 py-1 font-medium rounded-full ${streak >= 3 ? "animate-pulse" : ""}`}
                    >
                      <Flame className="w-4 h-4" />
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
                {gamePhase === "preview" && (
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
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
                        🧠
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Challenge Your Mind?</h3>
                      <p className="text-muted-foreground font-medium">Test your memory and build amazing streaks!</p>
                    </div>
                    <Button onClick={startGame} size="lg" className="px-8 py-4 text-lg font-semibold rounded-2xl">
                      <Play className="w-6 h-6 mr-2" />
                      Start New Game
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-6 gap-3 mb-6">
                      {tiles.map((tile, index) => (
                        <div
                          key={tile.id}
                          className={`aspect-square cursor-pointer perspective-1000 ${
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
                              <div className="w-full h-full bg-muted rounded-2xl border-2 border-border flex items-center justify-center shadow-lg hover:bg-muted/80 transition-colors">
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

                    <div className="flex justify-center gap-4">
                      <Button
                        onClick={startGame}
                        variant="outline"
                        className="flex items-center gap-2 font-medium bg-transparent rounded-2xl"
                      >
                        <RotateCcw className="w-4 h-4" />
                        New Game
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Session Stats */}
            <Card className="border shadow-lg animate-slide-in-right rounded-3xl">
              <CardHeader className="bg-primary text-primary-foreground rounded-t-3xl">
                <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                  <Star className="w-4 h-4" />
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
            <Card className="border shadow-lg animate-slide-in-right rounded-3xl" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="bg-primary text-primary-foreground rounded-t-3xl">
                <CardTitle className="flex items-center gap-2 font-semibold">
                  <Trophy className="w-5 h-5" />
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
                            ? "bg-primary/5 border-primary/20"
                            : index === 1
                              ? "bg-secondary/50 border-secondary"
                              : index === 2
                                ? "bg-muted/50 border-muted"
                                : "bg-background border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={index === 0 ? "default" : index <= 2 ? "secondary" : "outline"}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold p-0"
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
            <Card className="border shadow-lg animate-slide-in-right rounded-3xl" style={{ animationDelay: "0.2s" }}>
              <CardHeader className="bg-primary text-primary-foreground rounded-t-3xl">
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
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2 font-bold">
              <Trophy className="w-8 h-8 text-primary" />
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              You've completed the memory challenge!
            </DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce">🎉</div>
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
                  className="font-medium rounded-2xl"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-3 sm:gap-3">
            <Button
              onClick={() => setShowCompletionDialog(false)}
              variant="outline"
              className="flex-1 font-medium rounded-2xl"
            >
              Skip
            </Button>
            <Button onClick={saveScore} className="flex-1 font-medium rounded-2xl" disabled={!playerName.trim()}>
              Save Score
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
