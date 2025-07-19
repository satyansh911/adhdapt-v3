"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft, Volume2, VolumeX, Play, RotateCcw, Trophy, Medal, Award } from "lucide-react"
import ArrowIcon from "@/components/ui/arrowIcon"
import MindMazeIcon from "@/components/ui/mindMazeIcon"
import MusicIcon from "@/components/ui/MusicIcon"
import Star1Icon from "@/components/ui/Star1Icon"
import MedalIcon from "@/components/ui/MedalIcon"
import SquirrelIcon from "@/components/ui/SquirrelIcon"
import CatIcon from "@/components/ui/CatIcon"
import BeeIcon from "@/components/ui/BeeIcon"
import DuckIcon from "@/components/ui/DuckIcon"
import LeaderboardIcon from "@/components/ui/leaderboardIcon"
import VolumeOnIcon from "@/components/ui/VolumeOn"
import VolumeOffIcon from "@/components/ui/VolumeOff"
import TargetIcon from "@/components/ui/targetIcon"
import ProgressIcon from "@/components/ui/ProgressIcon"
import styles from "./sound_game.module.css";
import BadgeIcon from "@/components/ui/badgeIcon"
import Badge1Icon from "@/components/ui/Badge1Icon"
import ResetIcon from "@/components/ui/resetIcon"
import ConfettiIcon from "@/components/ui/ConfettiIcon"
import NormalPrizeIcon from "@/components/ui/NormalPrizeIcon"

interface SoundMemoryGameProps {
  onBack: () => void
  sidebarOpen: boolean
}

type GamePhase = "idle" | "showing" | "waiting" | "playing" | "gameOver"

interface SoundButton {
  id: number
  color: string
  hoverColor: string
  activeColor: string
  glowColor: string
  sound: number
  emoji: React.ReactNode
  name: string
  shape: string
}

interface LeaderboardEntry {
  id: string
  playerName: string
  score: number
  level: number
  date: string
  timestamp: number
}

const NameInputDialog = ({
    showNameInput,
    setShowNameInput,
    score,
    currentLevel,
    playerName,
    setPlayerName,
    addToLeaderboard,
  }: {
    showNameInput: boolean
    setShowNameInput: (value: boolean) => void
    score: number
    currentLevel: number
    playerName: string
    setPlayerName: (value: string) => void
    addToLeaderboard: (name: string, score: number, level: number) => void
  }) => (
    <Dialog open={showNameInput} onOpenChange={setShowNameInput}>
      <DialogContent className="sm:max-w-md bg-[#eef6e6] text-black">
        <DialogHeader>
          <ConfettiIcon size={80} />
          <DialogTitle className="text-center"> New High Score!</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-lg font-semibold">Score: {score}</p>
            <p className="text-sm text-muted-foreground">Level: {currentLevel - 1}</p>
          </div>
          <div>
            <label htmlFor="playerName" className="block text-sm font-medium mb-2">
              Enter your name:
            </label>
            <input
              id="playerName"
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={20}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addToLeaderboard(playerName, score, currentLevel - 1)
                }
              }}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={() => addToLeaderboard(playerName, score, currentLevel - 1)} className="flex-1 rounded-2xl bg-[#c9fded] shadow-[3px_3px_0px_0px_#99d04f] hover:bg-[#c9fded] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out">
              Save Score
            </Button>
            <Button onClick={() => setShowNameInput(false)} className="flex-1 rounded-2xl bg-[#ffffff] shadow-[3px_3px_0px_0px_#333333] hover:bg-[#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out">
              Skip
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

export default function SoundMemoryGame({ onBack, sidebarOpen }: SoundMemoryGameProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle")
  const [sequence, setSequence] = useState<number[]>([])
  const [playerSequence, setPlayerSequence] = useState<number[]>([])
  const [currentLevel, setCurrentLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [activeButton, setActiveButton] = useState<number | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showingIndex, setShowingIndex] = useState(0)
  const [message, setMessage] = useState("Press Start to begin!")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [playerName, setPlayerName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)
  const [isNewHighScore, setIsNewHighScore] = useState(false)

  // refs for icons
  const squirrelRef = useRef<any>(null)
  const catRef = useRef<any>(null)
  const beeRef = useRef<any>(null)
  const duckRef = useRef<any>(null)

  const iconRefs = [squirrelRef, catRef, beeRef, duckRef]

  const soundButtons: SoundButton[] = [
    {
      id: 0,
      color: "bg-gradient-to-br from-green-400 to-green-600",
      hoverColor: "hover:from-green-500 hover:to-green-700",
      activeColor: "from-green-300 to-green-500",
      glowColor: "shadow-green-400/50",
      sound: 261.63,
      emoji: <SquirrelIcon ref={squirrelRef} />,
      name: "Squirrel",
      shape: "rounded-full",
    },
    {
      id: 1,
      color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
      hoverColor: "hover:from-yellow-500 hover:to-yellow-700",
      activeColor: "from-yellow-300 to-yellow-500",
      glowColor: "shadow-yellow-400/50",
      sound: 329.63,
      emoji: <CatIcon ref={catRef} />,
      name: "Cat",
      shape: "rounded-2xl rotate-45",
    },
    {
      id: 2,
      color: "bg-gradient-to-br from-red-400 to-red-600",
      hoverColor: "hover:from-red-500 hover:to-red-700",
      activeColor: "from-red-300 to-red-500",
      glowColor: "shadow-red-400/50",
      sound: 392.0,
      emoji: <BeeIcon ref={beeRef} />,
      name: "Bee",
      shape: "rounded-3xl",
    },
    {
      id: 3,
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
      hoverColor: "hover:from-blue-500 hover:to-blue-700",
      activeColor: "from-blue-300 to-blue-500",
      glowColor: "shadow-blue-400/50",
      sound: 523.25,
      emoji: <DuckIcon ref={duckRef} />,
      name: "Duck",
      shape: "rounded-full",
    },
  ]

  // Load leaderboard from localStorage on component mount
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem("soundMemoryLeaderboard")
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard))
    }

    const savedPlayerName = localStorage.getItem("soundMemoryPlayerName")
    if (savedPlayerName) {
      setPlayerName(savedPlayerName)
    }
  }, [])

  // Save leaderboard to localStorage whenever it changes
  useEffect(() => {
    if (leaderboard.length > 0) {
      localStorage.setItem("soundMemoryLeaderboard", JSON.stringify(leaderboard))
    }
  }, [leaderboard])

  // Check if current score qualifies for leaderboard
  const checkHighScore = useCallback(
    (finalScore: number, finalLevel: number) => {
      const sortedLeaderboard = [...leaderboard].sort((a, b) => b.score - a.score)

      // Always allow entry if less than 10 entries, or if score beats the lowest score
      if (sortedLeaderboard.length < 10 || finalScore > (sortedLeaderboard[9]?.score || 0)) {
        setIsNewHighScore(true)
        setShowNameInput(true)
        return true
      }
      return false
    },
    [leaderboard],
  )

  // Add entry to leaderboard
  const addToLeaderboard = useCallback(
    (name: string, finalScore: number, finalLevel: number) => {
      const newEntry: LeaderboardEntry = {
        id: Date.now().toString(),
        playerName: name.trim() || "Anonymous",
        score: finalScore,
        level: finalLevel,
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
      }

      const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10) // Keep only top 10

      setLeaderboard(updatedLeaderboard)
      localStorage.setItem("soundMemoryPlayerName", name.trim())
      setShowNameInput(false)
      setShowLeaderboard(true)
    },
    [leaderboard],
  )

  // Sound generation with enhanced audio
  const preloadedAudio = useRef<Record<number, HTMLAudioElement>>({
    0: new Audio("/squirrel_sound.mp3"),
    1: new Audio("/cat_sound.mp3"),
    2: new Audio("/bee_sound.mp3"),
    3: new Audio("/duck_sound.mp3"),
  })

  const playSound = useCallback(
    (id: number) => {
      if (!soundEnabled) return

      const audio = preloadedAudio.current[id]
      if (audio) {
        audio.currentTime = 0
        audio.play()
      }
    },
    [soundEnabled]
  )


  // Generate new sequence
  const generateSequence = useCallback(() => {
    const newSequence = []
    for (let i = 0; i < currentLevel; i++) {
      newSequence.push(Math.floor(Math.random() * 4))
    }
    setSequence(newSequence)
    return newSequence
  }, [currentLevel])

  // Show sequence to player, now triggers icon animation
  const showSequence = useCallback(
    async (seq: number[]) => {
      setGamePhase("showing")
      setMessage("Watch and listen...")
      setShowingIndex(0)

      for (let i = 0; i < seq.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 600))

        setActiveButton(seq[i])
        setShowingIndex(i + 1)

        // Play icon animation
        iconRefs[seq[i]].current?.playAnimation?.()
        playSound(seq[i])


        await new Promise((resolve) => setTimeout(resolve, 600))
        setActiveButton(null)
      }

      setGamePhase("waiting")
      setMessage("Now repeat the sequence!")
      setPlayerSequence([])
    },
    [playSound, soundButtons, iconRefs],
  )

  // Start new game
  const startGame = useCallback(() => {
    setCurrentLevel(1)
    setScore(0)
    setPlayerSequence([])
    setIsNewHighScore(false)
    const newSeq = generateSequence()
    showSequence(newSeq)
  }, [generateSequence, showSequence])

  // Handle button click, now triggers icon animation
  const handleButtonClick = useCallback(
    (buttonId: number) => {
      if (gamePhase !== "waiting") return

      const newPlayerSequence = [...playerSequence, buttonId]
      setPlayerSequence(newPlayerSequence)
      setActiveButton(buttonId)

      // Play icon animation
      iconRefs[buttonId].current?.playAnimation?.()
      playSound(buttonId)
      setTimeout(() => setActiveButton(null), 200)

      // Check if sequence is correct so far
      if (sequence[newPlayerSequence.length - 1] !== buttonId) {
        // Wrong button - game over
        setGamePhase("gameOver")
        setMessage(`Game Over! Final Score: ${score}`)
        checkHighScore(score, currentLevel - 1) // Check if it's a high score
        return
      }

      // Check if sequence is complete
      if (newPlayerSequence.length === sequence.length) {
        // Correct sequence completed
        const newScore = score + currentLevel * 10
        setScore(newScore)
        setCurrentLevel(currentLevel + 1)
        setMessage("Great! Next level...")

        setTimeout(() => {
          const newSeq = generateSequence()
          showSequence(newSeq)
        }, 1000)
      }
    },
    [
      gamePhase,
      playerSequence,
      sequence,
      score,
      currentLevel,
      playSound,
      soundButtons,
      generateSequence,
      showSequence,
      checkHighScore,
      iconRefs,
    ],
  )

  // Reset game
  const resetGame = useCallback(() => {
    setGamePhase("idle")
    setSequence([])
    setPlayerSequence([])
    setCurrentLevel(1)
    setScore(0)
    setActiveButton(null)
    setShowingIndex(0)
    setMessage("Press Start to begin!")
    setIsNewHighScore(false)
    setShowNameInput(false)
  }, [])

  // Get rank icon based on position
  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <LeaderboardIcon size={50}/>
      case 2:
        return <MedalIcon size={50}/>
      case 3:
        return <Badge1Icon size={50}/>
      default:
        return (
          <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground mr-4 ml-3">
            <NormalPrizeIcon size={50}/>
          </span>
        )
    }
  }

  // Leaderboard dialog
  const LeaderboardDialog = () => (
    <Dialog open={showLeaderboard} onOpenChange={setShowLeaderboard}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto bg-[#eef6e6]">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2 text-black">
            <MedalIcon/>
            Leaderboard
            <MedalIcon/>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {leaderboard.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <LeaderboardIcon size={30}/>
              <p>No scores yet. Be the first to play!</p>
            </div>
          ) : (
            leaderboard.map((entry, index) => (
              <div
                key={entry.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border-black transition-colors ${
                  index === 0
                    ? "bg-yellow-300"
                    : index === 1
                    ? "bg-gray-300"
                    : index === 2
                    ? "bg-blue-300"
                    : "bg-white"
                }`}
              >
                <div className="flex-shrink-0">{getRankIcon(index + 1)}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{entry.playerName}</p>
                  <p className="text-sm text-muted-foreground">{entry.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{entry.score}</p>
                  <p className="text-sm text-muted-foreground">Level {entry.level}</p>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="flex justify-center pt-4">
          <Button variant={"outline"} className="rounded-2xl bg-[#c9fded] shadow-[3px_3px_0px_0px_#99d04f] hover:bg-[#c9fded] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out" onClick={() => setShowLeaderboard(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className={`min-h-screen bg-[#eaf8d8] transition-all duration-300 ${sidebarOpen ? "ml-0" : "ml-0"}`}>
      {/* Dynamic animated background */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced background elements with animations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-green-300 to-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300 to-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float"
            style={{ animationDelay: "4s" }}
          ></div>
          <div
            className="absolute top-20 left-1/4 w-64 h-64 bg-gradient-to-br from-red-300 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-float"
            style={{ animationDelay: "6s" }}
          ></div>

          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <Button
              onClick={onBack}
              variant="outline"
              size="sm"
              className={`flex relative ${sidebarOpen ? "-left-[8px]": "left-[65px]"} -top-[6px] border-black items-center gap-2 text-foreground rounded-2xl bg-[#c9fded] shadow-[3px_3px_0px_0px_#99d04f] hover:bg-[#c9fded] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out`}
            >
              <ArrowIcon/>
              Back to Arcade
            </Button>
            <div className="text-center flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground flex items-center justify-center relative -left-10">
                <MindMazeIcon/>
                EchoCritters
              </h1>
              <p className="text-muted-foreground text-lg font-medium relative -left-10 top-4">Critters call — will you answer right?</p>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowLeaderboard(true)}
                variant="ghost"
                size="sm"
                className="rounded-full w-12 h-12 bg-background/20 hover:bg-background/30 backdrop-blur-sm"
              >
                <LeaderboardIcon/>
              </Button>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant="ghost"
                size="sm"
                className="rounded-full w-12 h-12 bg-background/20 hover:bg-background/30 backdrop-blur-sm"
              >
                {soundEnabled ? <VolumeOnIcon/> : <VolumeOffIcon/>}
              </Button>
            </div>
          </div>

          {/* Game Title and Stats */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-6 mb-6">
              <Card className="bg-background/80 backdrop-blur-sm rounded-3xl animate-fade-in-scale bg-[#c9fded] shadow-[3px_3px_0px_0px_#99d04f] hover:bg-[#c9fded] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl"><MusicIcon/></span>
                    <span className="text-3xl font-bold text-foreground">{currentLevel}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Level</p>
                </CardContent>
              </Card>

              <Card
                className="bg-[#c9fded] backdrop-blur-sm rounded-3xl animate-fade-in-scale shadow-[3px_3px_0px_0px_#99d04f] hover:bg-[#c9fded] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out"
                style={{ animationDelay: "0.1s" }}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl"><Star1Icon/></span>
                    <span className="text-3xl font-bold text-foreground">{score}</span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Score</p>
                </CardContent>
              </Card>

              {leaderboard.length > 0 && (
                <Card
                  className="bg-[#c9fded] backdrop-blur-sm rounded-3xl animate-fade-in-scale shadow-[3px_3px_0px_0px_#99d04f] hover:bg-[#c9fded] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out"
                  style={{ animationDelay: "0.2s" }}
                >
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center gap-2 mb-2">
                      <MedalIcon/>
                      <span className="text-3xl font-bold text-foreground">{leaderboard[0]?.score || 0}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-medium">Best</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Game Message */}
            <div className="mb-8">
              <p className="text-xl font-semibold text-foreground mb-4 animate-fade-in">{message}</p>

              {/* Progress indicator during sequence showing */}
              {gamePhase === "showing" && (
                <div className="flex justify-center gap-3 mb-6">
                  {sequence.map((_, index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full transition-all duration-500 ${
                        index < showingIndex ? "bg-primary shadow-lg scale-110" : "bg-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Game Buttons */}
          <div className="flex justify-center mb-12">
            <div className="relative w-96 h-96">
              {soundButtons.map((button, index) => {
                const positions = [
                  { top: "10%", left: "50%", transform: "translate(-50%, -50%)" }, // Top
                  { top: "50%", left: "10%", transform: "translate(-50%, -50%)" }, // Left
                  { top: "50%", right: "10%", transform: "translate(50%, -50%)" }, // Right
                  { bottom: "10%", left: "50%", transform: "translate(-50%, 50%)" }, // Bottom
                ]

                return (
                  <div key={button.id} className="absolute" style={positions[index]}>
                    <button
                      onClick={() => handleButtonClick(button.id)}
                      disabled={gamePhase === "showing" || gamePhase === "idle"}
                      className={`
                        sound-button relative w-28 h-28 ${button.shape} transition-all duration-300 transform 
                        hover:scale-110 disabled:cursor-not-allowed overflow-hidden
                        ${
                          activeButton === button.id
                            ? `bg-gradient-to-br ${button.activeColor} scale-125 shadow-2xl ${button.glowColor} animate-sound-wave`
                            : `${button.color} ${button.hoverColor} shadow-xl hover:shadow-2xl`
                        }
                        ${gamePhase === "waiting" ? "hover:shadow-2xl" : ""}
                      `}
                    >
                      {/* Ripple effect */}
                      {activeButton === button.id && (
                        <div className="sound-button-ripple absolute inset-0 rounded-full"></div>
                      )}

                      {/* Emoji */}
                      <span className="relative z-10 text-5xl filter drop-shadow-lg">{button.emoji}</span>

                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                )
              })}

              {/* Center decoration */}
              <div
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full backdrop-blur-sm border border-white/30 flex items-center justify-center ${styles.container}`}
                style={{ width: "4rem", height: "4rem" }} // w-16 h-16
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary/50 to-primary/30 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center gap-6 mt-5">
            {gamePhase === "idle" && (
              <Button
                onClick={startGame}
                variant={"outline"}
                className="px-10 py-4 text-xl font-bold rounded-3xl bg-[#c9fded] border-black shadow-[3px_3px_0px_0px_#99d04f] hover:bg-[#c9fded] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out"
              >
                <img src="/play.png" className="w-5 h-5"/>
                Start Listening
              </Button>
            )}

            {gamePhase === "gameOver" && (
              <div className="flex gap-6">
                <Button
                  onClick={startGame}
                  className="px-10 py-4 text-xl font-bold rounded-3xl bg-[#c9fded] shadow-[3px_3px_0px_0px_#99d04f] hover:bg-[#c9fded] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                >
                  <img src="/play.png" className="w-5 h-5"/>
                  Play Again
                </Button>
                <Button
                  onClick={resetGame}
                  className="px-8 py-4 text-lg font-semibold rounded-3xl bg-[#ffffff] shadow-[3px_3px_0px_0px_#333333] hover:bg-[#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                  style={{ animationDelay: "0.1s" }}
                >
                  <ResetIcon size={20}/>
                  Reset
                </Button>
              </div>
            )}

            {(gamePhase === "waiting" || gamePhase === "showing") && (
              <Button
                onClick={resetGame}
                className="px-8 py-3 text-lg font-semibold rounded-3xl bg-[#ffffff] shadow-[3px_3px_0px_0px_#333333] hover:bg-[#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
              >
                <ResetIcon size={20}/>
                Reset Game
              </Button>
            )}
          </div>

          {/* Enhanced Instructions */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card
              className="bg-[#c9fded] shadow-[5px_5px_0px_0px_#99d04f] hover:bg-[#c9fded] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out backdrop-blur-sm rounded-3xl animate-fade-in-up"
              style={{ animationDelay: "0.3s" }}
            >
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  How to Play
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-base text-muted-foreground">
                  <div className="space-y-3">
                    <p className="flex items-center gap-3">
                      <span className="text-2xl"><MusicIcon size={30}/></span>
                      <span>
                        <strong className="text-foreground">Listen:</strong> Watch and listen to the sequence of sounds
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-2xl"><TargetIcon/></span>
                      <span>
                        <strong className="text-foreground">Repeat:</strong> Click the buttons in the same order
                      </span>
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="flex items-center gap-3">
                      <span className="text-2xl"><ProgressIcon size={35}/></span>
                      <span>
                        <strong className="text-foreground">Progress:</strong> Each level adds one more sound to
                        remember
                      </span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="text-2xl"><LeaderboardIcon size={35}/></span>
                      <span>
                        <strong className="text-foreground">Compete:</strong> Beat high scores and climb the leaderboard
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <NameInputDialog
        showNameInput={showNameInput}
        setShowNameInput={setShowNameInput}
        score={score}
        currentLevel={currentLevel}
        playerName={playerName}
        setPlayerName={setPlayerName}
        addToLeaderboard={addToLeaderboard}
      />
      <LeaderboardDialog />
    </div>
  )
}
