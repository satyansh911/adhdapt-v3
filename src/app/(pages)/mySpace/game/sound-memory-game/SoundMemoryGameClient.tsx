"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
import Badge1Icon from "@/components/ui/Badge1Icon"
import ResetIcon from "@/components/ui/resetIcon"
import ConfettiIcon from "@/components/ui/ConfettiIcon"
import NormalPrizeIcon from "@/components/ui/NormalPrizeIcon"
import Image from "next/image"
import { cn } from "@/lib/utils"

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

interface IconHandle {
  playAnimation: () => void;
}

export function SoundMemoryGame({ onBack, sidebarOpen }: SoundMemoryGameProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>("idle")
  const [sonicBlueprint, setSonicBlueprint] = useState<number[]>([])
  const [userReplication, setUserReplication] = useState<number[]>([])
  const [progressionTier, setProgressionTier] = useState(1)
  const [achievementPoints, setAchievementPoints] = useState(0)
  const [activeStimulus, setActiveStimulus] = useState<number | null>(null)
  const [isAudioActive, setIsAudioActive] = useState(true)
  const [playbackIndex, setPlaybackIndex] = useState(0)
  const [statusMessage, setStatusMessage] = useState("Press Start to begin!")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [playerName, setPlayerName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)

  // strictly typed refs for icons
  const sylvanLeaperRef = useRef<IconHandle>(null)
  const felineStalkerRef = useRef<IconHandle>(null)
  const nectarSeekerRef = useRef<IconHandle>(null)
  const aqueousPaddlerRef = useRef<IconHandle>(null)

  const iconRefs = useMemo(
    () => [sylvanLeaperRef, felineStalkerRef, nectarSeekerRef, aqueousPaddlerRef],
    [],
  )

  const soundButtons: SoundButton[] = useMemo(
    () => [
      {
        id: 0,
        color: "bg-gradient-to-br from-green-400 to-green-600",
        hoverColor: "hover:from-green-500 hover:to-green-700",
        activeColor: "from-green-300 to-green-500",
        glowColor: "shadow-green-400/50",
        sound: 261.63,
        emoji: <SquirrelIcon ref={sylvanLeaperRef} />,
        name: "Squirrel",
        shape: "rounded-full",
      },
      {
        id: 1,
        color: "bg-gradient-to-br from-blue-400 to-blue-600",
        hoverColor: "hover:from-blue-500 hover:to-blue-700",
        activeColor: "from-blue-300 to-blue-500",
        glowColor: "shadow-blue-400/50",
        sound: 293.66,
        emoji: <CatIcon ref={felineStalkerRef} />,
        name: "Cat",
        shape: "rounded-[2rem]",
      },
      {
        id: 2,
        color: "bg-gradient-to-br from-yellow-400 to-yellow-600",
        hoverColor: "hover:from-yellow-500 hover:to-yellow-700",
        activeColor: "from-yellow-300 to-yellow-500",
        glowColor: "shadow-yellow-400/50",
        sound: 329.63,
        emoji: <BeeIcon ref={nectarSeekerRef} />,
        name: "Bee",
        shape: "rounded-[3rem]",
      },
      {
        id: 3,
        color: "bg-gradient-to-br from-red-400 to-red-600",
        hoverColor: "hover:from-red-500 hover:to-red-700",
        activeColor: "from-red-300 to-red-500",
        glowColor: "shadow-red-400/50",
        sound: 349.23,
        emoji: <DuckIcon ref={aqueousPaddlerRef} />,
        name: "Duck",
        shape: "rounded-[1.5rem]",
      },
    ],
    [sylvanLeaperRef, felineStalkerRef, nectarSeekerRef, aqueousPaddlerRef],
  )

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

  const toggleAudio = () => setIsAudioActive(!isAudioActive)

  const playSound = useCallback(
    (frequency: number) => {
      if (!isAudioActive) return
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      const oscillator = audioCtx.createOscillator()
      const gainNode = audioCtx.createGain()

      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime)
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5)

      oscillator.connect(gainNode)
      gainNode.connect(audioCtx.destination)

      oscillator.start()
      oscillator.stop(audioCtx.currentTime + 0.5)
    },
    [isAudioActive],
  )

  const startGame = () => {
    const newBaseline = [Math.floor(Math.random() * 4)]
    setSonicBlueprint(newBaseline)
    setProgressionTier(1)
    setAchievementPoints(0)
    setUserReplication([])
    setPlaybackIndex(0)
    setGamePhase("showing")
    setStatusMessage("Watch carefully!")
  }

  const playPattern = useCallback(async () => {
    if (playbackIndex < sonicBlueprint.length) {
      const buttonId = sonicBlueprint[playbackIndex]
      setActiveStimulus(buttonId)
      playSound(soundButtons[buttonId].sound)
      iconRefs[buttonId].current?.playAnimation()

      setTimeout(() => {
        setActiveStimulus(null)
        setPlaybackIndex(playbackIndex + 1)
      }, 600)
    } else {
      setGamePhase("waiting")
      setStatusMessage("Your turn!")
      setUserReplication([])
    }
  }, [playbackIndex, sonicBlueprint, playSound, iconRefs, soundButtons])

  useEffect(() => {
    if (gamePhase === "showing") {
      const timer = setTimeout(playPattern, 400)
      return () => clearTimeout(timer)
    }
  }, [gamePhase, playPattern])

  const handleButtonClick = (id: number) => {
    if (gamePhase !== "waiting") return

    playSound(soundButtons[id].sound)
    iconRefs[id].current?.playAnimation()
    setActiveStimulus(id)
    setTimeout(() => setActiveStimulus(null), 300)

    const updatedReplication = [...userReplication, id]
    setUserReplication(updatedReplication)

    if (id !== sonicBlueprint[updatedReplication.length - 1]) {
      setStatusMessage(`Game Over! Final Score: ${achievementPoints}`)
      setGamePhase("gameOver")
      if (achievementPoints > (leaderboard[leaderboard.length - 1]?.score || 0) || leaderboard.length < 10) {
        setShowNameInput(true)
      }
      return
    }

    if (updatedReplication.length === sonicBlueprint.length) {
      setAchievementPoints(achievementPoints + progressionTier * 10)
      setProgressionTier(progressionTier + 1)
      setStatusMessage("Great job! Next level...")
      setPlaybackIndex(0)
      setGamePhase("showing")
      setSonicBlueprint([...sonicBlueprint, Math.floor(Math.random() * 4)])
    }
  }

  // Reset game
  const resetGame = () => {
    setSonicBlueprint([])
    setUserReplication([])
    setProgressionTier(1)
    setAchievementPoints(0)
    setActiveStimulus(null)
    setPlaybackIndex(0)
    setStatusMessage("Press Start to begin!")
    setGamePhase("idle")
    setShowNameInput(false)
  }

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
                  onClick={toggleAudio}
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-[#ffffff] border-2 border-black hover:bg-[#ffffff] shadow-[2px_2px_0px_0px_#333333] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                >
                  {isAudioActive ? <VolumeOnIcon /> : <VolumeOffIcon />}
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
                    <span className="text-3xl font-bold text-foreground">{progressionTier - 1}</span>
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
                    <span className="text-3xl font-bold text-foreground">{achievementPoints}</span>
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
            <div className="mb-8">                <p className="text-xl font-bold text-[#d04f99] mt-2 mb-6 min-h-[1.5rem] animate-pulse">
                  {statusMessage}
                </p>

                <div className="relative mb-2">
                  <div className="flex gap-4 justify-center">
                    {sonicBlueprint.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-3 h-3 rounded-full border border-black transition-all duration-300",
                          index < playbackIndex ? "bg-[#d04f99] scale-110" : "bg-white",
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 max-w-md mx-auto relative z-10">
                  {soundButtons.map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => handleButtonClick(btn.id)}
                      disabled={gamePhase !== "waiting"}
                      className={cn(
                        "aspect-square rounded-3xl relative overflow-hidden transition-all duration-200 border-4 border-black group",
                        btn.color,
                        btn.glowColor,
                        gamePhase === "waiting" ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-default",
                        activeStimulus === btn.id ? "brightness-125 scale-110 z-20 shadow-[0_0_30px_rgba(255,255,255,0.8)]" : "opacity-90 hover:opacity-100",
                        gamePhase === "waiting" ? btn.hoverColor : "",
                        btn.id === activeStimulus ? "ring-4 ring-white" : "",
                      )}
                    >
                      <span className="relative z-10 text-5xl filter drop-shadow-lg">{btn.emoji}</span>
                    </button>
                  ))}
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
                <Image src="/play.png" alt="Play Icon" width={20} height={20} className="w-5 h-5 mr-2" />
                Start Listening
              </Button>
            )}

            {gamePhase === "gameOver" && (
              <div className="flex gap-6">
                <Button
                  onClick={startGame}
                  className="px-10 py-4 text-xl font-bold rounded-3xl bg-[#c9fded] shadow-[3px_3px_0px_0px_#99d04f] hover:bg-[#c9fded] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200"
                >
                  <Image src="/play.png" alt="Play Icon" width={20} height={20} className="w-5 h-5 mr-2" />
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
          score={achievementPoints}
          currentLevel={progressionTier}
          playerName={playerName}
          setPlayerName={setPlayerName}
          addToLeaderboard={addToLeaderboard}
        />
      <LeaderboardDialog />
    </div>
  )
}

export default function SoundMemoryGamePage() {
  return <SoundMemoryGame onBack={() => window.history.back()} sidebarOpen={true} />
}
