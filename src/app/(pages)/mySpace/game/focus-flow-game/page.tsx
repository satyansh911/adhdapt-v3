"use client"

import { useState, useEffect, useRef } from "react"
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
import { Timer, Trophy, RotateCcw, Play, Target, Award, ArrowLeft, Search, X, CheckCircle } from "lucide-react"
import Loader1 from "@/components/ui/Loader1"
import SearchIcon from "@/components/ui/SearchIcon"
import FocusFlowIcon from "@/components/ui/focusFlowIcon"
import TimerIcon from "@/components/ui/timerIcon"
import BadgeIcon from "@/components/ui/badgeIcon"
import TargetIcon from "@/components/ui/targetIcon"
import TrophyIcon from "@/components/ui/trophyIcon"
import LeaderboardIcon from "@/components/ui/leaderboardIcon"
import ArrowIcon from "@/components/ui/arrowIcon"
import PencilIcon from "@/components/ui/PencilIcon"
import ConfettiIcon from "@/components/ui/ConfettiIcon"

interface GridCell {
  letter: string
  row: number
  col: number
  isSelected: boolean
  isPartOfFoundWord: boolean
  wordId?: string
}

interface WordPosition {
  word: string
  startRow: number
  startCol: number
  direction: "horizontal" | "vertical" | "diagonal-down" | "diagonal-up"
  positions: { row: number; col: number }[]
}

interface LeaderboardEntry {
  name: string
  time: number
  wordsFound: number
  date: string
}

interface FocusFlowGameProps {
  onBack: () => void
  sidebarOpen?: boolean
}

export default function FocusFlowGame({ onBack, sidebarOpen = true }: FocusFlowGameProps) {
  const [grid, setGrid] = useState<GridCell[][]>([])
  const [words, setWords] = useState<string[]>([])
  const [hiddenWords, setHiddenWords] = useState<WordPosition[]>([])
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set())
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [time, setTime] = useState(0)
  const [isGameActive, setIsGameActive] = useState(false)
  const [gamePhase, setGamePhase] = useState<"idle" | "playing" | "finished">("idle")
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [playerName, setPlayerName] = useState("")
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const GRID_SIZE = 15
  const WORD_LIST = [
    "FOCUS",
    "BRAIN",
    "MIND",
    "THINK",
    "LEARN",
    "SMART",
    "QUICK",
    "SHARP",
    "MEMORY",
    "LOGIC",
    "SOLVE",
    "PUZZLE",
    "GAME",
    "PLAY",
    "WIN",
    "FAST",
    "SKILL",
    "POWER",
    "BOOST",
    "TRAIN",
    "GROW",
    "STRONG",
    "CLEAR",
    "BRIGHT",
  ]

  // Load leaderboard from localStorage
  useEffect(() => {
    const savedLeaderboard = localStorage.getItem("focus-flow-leaderboard")
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

  // Generate random grid with hidden words
  const generateGrid = () => {
    // Select 8-12 random words
    const selectedWords = WORD_LIST.sort(() => Math.random() - 0.5).slice(0, 8 + Math.floor(Math.random() * 5))
    const newGrid: GridCell[][] = Array(GRID_SIZE)
      .fill(null)
      .map((_, row) =>
        Array(GRID_SIZE)
          .fill(null)
          .map((_, col) => ({
            letter: "",
            row,
            col,
            isSelected: false,
            isPartOfFoundWord: false,
          })),
      )

    const placedWords: WordPosition[] = []

    // Try to place each word
    selectedWords.forEach((word) => {
      let placed = false
      let attempts = 0

      while (!placed && attempts < 50) {
        const direction = ["horizontal", "vertical", "diagonal-down", "diagonal-up"][
          Math.floor(Math.random() * 4)
        ] as WordPosition["direction"]
        const startRow = Math.floor(Math.random() * GRID_SIZE)
        const startCol = Math.floor(Math.random() * GRID_SIZE)

        if (canPlaceWord(newGrid, word, startRow, startCol, direction)) {
          placeWord(newGrid, word, startRow, startCol, direction, placedWords)
          placed = true
        }
        attempts++
      }
    })

    // Fill empty cells with random letters
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (newGrid[row][col].letter === "") {
          newGrid[row][col].letter = String.fromCharCode(65 + Math.floor(Math.random() * 26))
        }
      }
    }

    setGrid(newGrid)
    setHiddenWords(placedWords)
    setWords(placedWords.map((w) => w.word))
    setFoundWords(new Set())
  }

  const canPlaceWord = (
    grid: GridCell[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: WordPosition["direction"],
  ): boolean => {
    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      "diagonal-down": [1, 1],
      "diagonal-up": [-1, 1],
    }

    const [dRow, dCol] = directions[direction]

    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dRow
      const col = startCol + i * dCol

      if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE) {
        return false
      }

      if (grid[row][col].letter !== "" && grid[row][col].letter !== word[i]) {
        return false
      }
    }

    return true
  }

  const placeWord = (
    grid: GridCell[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: WordPosition["direction"],
    placedWords: WordPosition[],
  ) => {
    const directions = {
      horizontal: [0, 1],
      vertical: [1, 0],
      "diagonal-down": [1, 1],
      "diagonal-up": [-1, 1],
    }

    const [dRow, dCol] = directions[direction]
    const positions: { row: number; col: number }[] = []

    for (let i = 0; i < word.length; i++) {
      const row = startRow + i * dRow
      const col = startCol + i * dCol
      grid[row][col].letter = word[i]
      positions.push({ row, col })
    }

    placedWords.push({
      word,
      startRow,
      startCol,
      direction,
      positions,
    })
  }

  const startGame = () => {
    generateGrid()
    setTime(0)
    setIsGameActive(true)
    setGamePhase("playing")
    setShowCompletionDialog(false)
    setShowCelebration(false)
  }

  const endGame = () => {
    setGrid([])
    setWords([])
    setHiddenWords([])
    setFoundWords(new Set())
    setSelectedCells([])
    setTime(0)
    setIsGameActive(false)
    setGamePhase("idle")
    setShowCompletionDialog(false)
    setShowCelebration(false)
  }

  const handleMouseDown = (row: number, col: number) => {
    if (gamePhase !== "playing") return
    setIsSelecting(true)
    setSelectedCells([{ row, col }])
    updateGridSelection([{ row, col }])
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting || gamePhase !== "playing") return

    const newSelection = [...selectedCells]
    const lastCell = newSelection[newSelection.length - 1]

    // Check if this forms a valid line (horizontal, vertical, or diagonal)
    if (newSelection.length === 1 || isValidLine(newSelection[0], { row, col })) {
      // Remove cells that are not in the direct line
      const lineSelection = getLineSelection(newSelection[0], { row, col })
      setSelectedCells(lineSelection)
      updateGridSelection(lineSelection)
    }
  }

  const handleMouseUp = () => {
    if (!isSelecting || gamePhase !== "playing") return
    setIsSelecting(false)
    checkSelectedWord()
  }

  const isValidLine = (start: { row: number; col: number }, end: { row: number; col: number }): boolean => {
    const rowDiff = Math.abs(end.row - start.row)
    const colDiff = Math.abs(end.col - start.col)

    // Horizontal, vertical, or diagonal
    return rowDiff === 0 || colDiff === 0 || rowDiff === colDiff
  }

  const getLineSelection = (
    start: { row: number; col: number },
    end: { row: number; col: number },
  ): { row: number; col: number }[] => {
    const selection: { row: number; col: number }[] = []
    const rowDiff = end.row - start.row
    const colDiff = end.col - start.col
    const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))

    const rowStep = steps === 0 ? 0 : rowDiff / steps
    const colStep = steps === 0 ? 0 : colDiff / steps

    for (let i = 0; i <= steps; i++) {
      selection.push({
        row: start.row + Math.round(i * rowStep),
        col: start.col + Math.round(i * colStep),
      })
    }

    return selection
  }

  const updateGridSelection = (selection: { row: number; col: number }[]) => {
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          isSelected: selection.some((s) => s.row === cell.row && s.col === cell.col),
        })),
      ),
    )
  }

  const checkSelectedWord = () => {
    if (selectedCells.length < 2) {
      clearSelection()
      return
    }

    const selectedWord = selectedCells.map((cell) => grid[cell.row][cell.col].letter).join("")
    const reverseWord = selectedWord.split("").reverse().join("")

    // Check if selected word matches any hidden word
    const matchedWord = hiddenWords.find((hiddenWord) => {
      const wordPositions = hiddenWord.positions
      const selectedPositions = selectedCells

      // Check if positions match (forward or backward)
      const forwardMatch =
        wordPositions.length === selectedPositions.length &&
        wordPositions.every(
          (pos, index) =>
            selectedPositions[index] &&
            pos.row === selectedPositions[index].row &&
            pos.col === selectedPositions[index].col,
        )

      const backwardMatch =
        wordPositions.length === selectedPositions.length &&
        wordPositions.every(
          (pos, index) =>
            selectedPositions[selectedPositions.length - 1 - index] &&
            pos.row === selectedPositions[selectedPositions.length - 1 - index].row &&
            pos.col === selectedPositions[selectedPositions.length - 1 - index].col,
        )

      return forwardMatch || backwardMatch
    })

    if (matchedWord && !foundWords.has(matchedWord.word)) {
      // Mark word as found
      setFoundWords((prev) => new Set([...prev, matchedWord.word]))

      // Mark cells as part of found word
      setGrid((prevGrid) =>
        prevGrid.map((row) =>
          row.map((cell) => {
            const isPartOfWord = matchedWord.positions.some((pos) => pos.row === cell.row && pos.col === cell.col)
            return {
              ...cell,
              isSelected: false,
              isPartOfFoundWord: cell.isPartOfFoundWord || isPartOfWord,
              wordId: isPartOfWord ? matchedWord.word : cell.wordId,
            }
          }),
        ),
      )
    } else {
      clearSelection()
    }

    setSelectedCells([])
  }

  const clearSelection = () => {
    setGrid((prevGrid) =>
      prevGrid.map((row) =>
        row.map((cell) => ({
          ...cell,
          isSelected: false,
        })),
      ),
    )
  }

  // Check for game completion
  useEffect(() => {
    if (foundWords.size === words.length && words.length > 0 && gamePhase === "playing") {
      setIsGameActive(false)
      setGamePhase("finished")
      setShowCelebration(true)

      setTimeout(() => {
        setShowCompletionDialog(true)
      }, 1000)

      setTimeout(() => {
        setShowCelebration(false)
      }, 5000)
    }
  }, [foundWords.size, words.length, gamePhase])

  // Save score to leaderboard
  const saveScore = () => {
    if (!playerName.trim()) return

    const newEntry: LeaderboardEntry = {
      name: playerName.trim(),
      time,
      wordsFound: foundWords.size,
      date: new Date().toLocaleDateString(),
    }

    const updatedLeaderboard = [...leaderboard, newEntry].sort((a, b) => a.time - b.time).slice(0, 10)

    setLeaderboard(updatedLeaderboard)
    localStorage.setItem("focus-flow-leaderboard", JSON.stringify(updatedLeaderboard))
    setShowCompletionDialog(false)
    setPlayerName("")
  }

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const gameProgress = words.length > 0 ? (foundWords.size / words.length) * 100 : 0

  return (
    <div className="min-h-screen p-4 animate-fade-in">
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

          {/* Central celebration text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-celebration-bounce">
              <div className="text-8xl mb-4 animate-celebration-pulse">🎉</div>
              <h2 className="text-4xl md:text-6xl font-bold text-primary mb-2 animate-celebration-pulse">EXCELLENT!</h2>
              <p className="text-xl md:text-2xl text-muted-foreground font-semibold animate-fade-in">
                All words found!
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={onBack} className="rounded-full bg-[#edc9fd] shadow-[3px_3px_0px_0px_#4f99d0] hover:bg-[#edc9fd] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out">
              <ArrowIcon/>
              Back to Arcade
            </Button>
          </div>
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground flex items-center justify-center relative -left-10">
              <FocusFlowIcon/>
              SpellBound
            </h1>
            <p className="text-muted-foreground text-lg font-medium relative -left-10 top-4">Find hidden words in the letter matrix</p>
          </div>
          <div className="w-24"></div>
        </div>

        <div className={`grid gap-8 transition-all duration-300 ${sidebarOpen ? "lg:grid-cols-4" : "lg:grid-cols-5"}`}>
          {/* Game Board */}
          <div
            className={`animate-slide-in transition-all duration-300 ${sidebarOpen ? "lg:col-span-3" : "lg:col-span-4"}`}
          >
            <Card className="border shadow-[5px_5px_0px_0px_#4f99d0] border-[#4f99d0] rounded-3xl bg-[#edc9fd]">
              <CardHeader className="bg-[#4f99d0] text-white rounded-t-3xl">
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                    <SearchIcon/>
                    Word Search
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1 font-medium rounded-full">
                      <TimerIcon/>
                      {formatTime(time)}
                    </Badge>
                    <Badge variant="secondary" className="px-3 py-1 font-medium rounded-full">
                      <BadgeIcon/>
                      {foundWords.size}/{words.length}
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
                {grid.length === 0 ? (
                  <div className="text-center py-16 animate-fade-in-scale">
                    <div className="mb-8">
                      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-4xl mx-auto mb-16">
                        <Loader1/>
                      </div>
                      <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Find Words?</h3>
                      <p className="text-muted-foreground font-medium">Search for hidden words in all directions!</p>
                    </div>
                    <Button onClick={startGame} size="lg" className="px-8 py-4 text-lg font-semibold rounded-2xl bg-[#ffffff] shadow-[3px_3px_0px_0px_#4f99d0] hover:bg-[#ffffff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all duration-200 ease-in-out">
                      <img src="/play.png" className="w-6 h-6"/>
                      Start New Game
                    </Button>
                  </div>
                ) : (
                  <>
                    <div
                      ref={gridRef}
                      className="grid grid-cols-15 gap-1 max-w-fit mx-auto mb-6 select-none"
                      style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
                      onMouseLeave={() => setIsSelecting(false)}
                    >
                      {grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`w-8 h-8 flex items-center justify-center text-sm font-bold border-2 rounded cursor-pointer transition-all duration-200 ${
                              cell.isPartOfFoundWord
                                ? "bg-green-200 border-green-400 text-green-800"
                                : cell.isSelected
                                  ? "bg-blue-200 border-blue-400 text-blue-800"
                                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                            onMouseUp={handleMouseUp}
                          >
                            {cell.letter}
                          </div>
                        )),
                      )}
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
                      {isGameActive && (
                        <Button
                          onClick={endGame}
                          variant="destructive"
                          className="flex items-center gap-2 font-medium rounded-2xl"
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
            {/* Words List */}
            <Card className="border animate-slide-in-right rounded-3xl shadow-[5px_5px_0px_0px_#4f99d0] border-[#4f99d0] bg-[#edc9fd]">
              <CardHeader className="bg-[#4f99d0] text-white rounded-t-3xl">
                <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                  <TargetIcon/>
                  Words to Find
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {words.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-4xl"><PencilIcon/></div>
                    <p className="text-muted-foreground font-medium">Start a game to see words!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {words.map((word, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 rounded-lg transition-all duration-200 ${
                          foundWords.has(word)
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-white border border-gray-200"
                        }`}
                      >
                        <span className={`font-medium ${foundWords.has(word) ? "line-through" : ""}`}>{word}</span>
                        {foundWords.has(word) && <CheckCircle className="w-4 h-4 text-green-600" />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card
              className="border animate-slide-in-right rounded-3xl shadow-[5px_5px_0px_0px_#4f99d0] border-[#4f99d0] bg-[#edc9fd]"
              style={{ animationDelay: "0.1s" }}
            >
              <CardHeader className="bg-[#4f99d0] text-white rounded-t-3xl">
                <CardTitle className="flex items-center gap-2 font-semibold">
                  <LeaderboardIcon/>
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {leaderboard.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3"><LeaderboardIcon/></div>
                    <p className="text-muted-foreground font-medium">Be the first champion!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {leaderboard.map((entry, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-2xl border transition-all duration-200 text-white ${
                          index === 0
                            ? "bg-[#333333]"
                            : index === 1
                              ? "bg-[#d2e284]"
                              : index === 2
                                ? "bg-[#5b5b5b]"
                                : "bg-[#4f99d0]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={index === 0 ? "default" : index <= 2 ? "secondary" : "outline"}
                              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold p-0 bg-[#edc9fd] text-black"
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
                            <p className="text-xs text-muted-foreground">{entry.wordsFound} words</p>
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
              className="border animate-slide-in-right rounded-3xl shadow-[5px_5px_0px_0px_#4f99d0] border-[#4f99d0] bg-[#edc9fd]"
              style={{ animationDelay: "0.2s" }}
            >
              <CardHeader className="bg-[#4f99d0] text-white rounded-t-3xl">
                <CardTitle className="text-sm font-semibold">How to Play</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2 p-4 font-medium">
                <p>🔍 Find words in the letter grid</p>
                <p>↔️ Words can be horizontal, vertical, or diagonal</p>
                <p>🖱️ Click and drag to select words</p>
                <p>✅ Found words will be highlighted</p>
                <p>⚡ Complete as fast as possible!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Game Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-[#4f99d0] text-black">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl flex items-center justify-center gap-2 font-bold">
              <LeaderboardIcon size={40} />
              Congratulations!
            </DialogTitle>
            <DialogDescription className="text-center text-lg">You found all the words!</DialogDescription>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce"><ConfettiIcon size={80}/></div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary font-mono">{formatTime(time)}</p>
                <p className="text-xs text-muted-foreground font-medium">Time</p>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">{foundWords.size}</p>
                <p className="text-xs text-muted-foreground font-medium">Words Found</p>
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
              variant="outline"
              className="flex-1 font-medium rounded-2xl bg-[#ffffff] shadow-[4px_4px_0px_0px_#333333] hover:bg-[#ffffff] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all duration-200 ease-in-out"
            >
              Skip
            </Button>
            <Button onClick={saveScore} variant={"outline"} className="flex-1 font-medium rounded-2xl bg-[#e2a7fb] shadow-[4px_4px_0px_0px_#d2e284] hover:bg-[#e2a7fb] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all duration-200 ease-in-out" disabled={!playerName.trim()}>
              Save Score
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
