"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider"; // Assuming shadcn/ui slider is available
import {
  Play,
  Pause,
  RotateCcw,
  TreePine,
  SproutIcon as Seed,
  Leaf,
  XCircle,
} from "lucide-react";

// Using a public domain sound for demo. In a real app, host your own.
const NOTIFICATION_SOUND_URL = "https://www.soundjay.com/buttons/beep-07.mp3";

// Tree stages based on progress (0-100%)
const getTreeIcon = (
  progress: number,
  isRunning: boolean,
  isSessionCompleted: boolean
) => {
  if (!isRunning && !isSessionCompleted && progress === 0) {
    return (
      <Seed className="w-24 h-24 text-gray-400 transition-transform duration-500" />
    ); // Initial seed
  }
  if (!isRunning && !isSessionCompleted && progress > 0) {
    return (
      <XCircle className="w-24 h-24 text-red-500 transition-transform duration-500" />
    ); // Withered tree if paused early
  }
  if (isSessionCompleted) {
    return (
      <TreePine className="w-24 h-24 text-[#d04f99] transition-transform duration-500" />
    ); // Full tree for completed
  }
  if (progress < 33) {
    return (
      <Seed className="w-24 h-24 text-green-400 transition-transform duration-500" />
    ); // Growing seed
  }
  if (progress < 66) {
    return (
      <Leaf className="w-24 h-24 text-green-500 transition-transform duration-500" />
    ); // Sapling
  }
  return (
    <TreePine className="w-24 h-24 text-[#d04f99] transition-transform duration-500" />
  ); // Nearly full tree
};

export default function PomodoroTimer() {
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [sessionDuration, setSessionDuration] = useState(25 * 60); // Default 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [treesPlanted, setTreesPlanted] = useState(0);
  const [isSessionCompleted, setIsSessionCompleted] = useState(false); // New state for completion status

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /* ───────────────────────── helpers ───────────────────────── */

  const formatTime = useCallback((totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, []);

  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((e) => console.error("Error playing sound:", e));
    }
  }, []);

  const clearTimerInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  /* ─────────────────────── controls ───────────────────────── */

  const handleStartFocus = useCallback(() => {
    if (isRunning) return;
    if (timeRemaining === 0) {
      setTimeRemaining(sessionDuration); // Reset if starting fresh or after completion
    }
    setIsRunning(true);
    setIsSessionCompleted(false); // Reset completion status
    lastTickRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastTickRef.current) / 1000; // in seconds
      lastTickRef.current = now;

      setTimeRemaining((prev) => {
        const newTime = Math.max(0, prev - elapsed);
        if (newTime === 0) {
          clearTimerInterval();
          setIsRunning(false);
          setIsSessionCompleted(true); // Mark session as completed
          setTreesPlanted((prevCount) => prevCount + 1);
          playNotificationSound();
          // Optionally, you could automatically start a break timer here
        }
        return newTime;
      });
    }, 200); // update 5x/sec for smoothness
  }, [isRunning, timeRemaining, sessionDuration, playNotificationSound]);

  const handlePause = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    clearTimerInterval();
    // If paused before completion, the tree withers (handled by getTreeIcon)
  }, [isRunning]);

  const handleReset = useCallback(() => {
    clearTimerInterval();
    setIsRunning(false);
    setTimeRemaining(sessionDuration); // Reset to the current selected duration
    setTaskName("");
    setIsSessionCompleted(false); // Reset completion status
  }, [sessionDuration]);

  const handleSliderChange = useCallback(
    (value: number[]) => {
      const newDuration = value[0] * 60; // Convert minutes to seconds
      setSessionDuration(newDuration);
      if (!isRunning) {
        setTimeRemaining(newDuration); // Only update timeRemaining if not running
      }
    },
    [isRunning]
  );

  /* ────────────────────── clean-up & effects ─────────────────────────── */

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
    audioRef.current.load(); // Preload the sound

    // Set initial time remaining to default session duration
    setTimeRemaining(sessionDuration);

    return () => {
      clearTimerInterval();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [sessionDuration]); // Re-run if sessionDuration changes (e.g., on initial load)

  /* ─────────────────────── derived values ────────────────────────── */
  const progressPercentage =
    sessionDuration > 0
      ? ((sessionDuration - timeRemaining) / sessionDuration) * 100
      : 0;

  /* ───────────────────────── render ───────────────────────── */

  return (
    <Card className="max-w-md w-full mx-auto shadow-[5px_5px_0px_0px_#d04f99] border-[#d04f99] border rounded-3xl bg-[#fdedc9] transform transition-all duration-300 hover:scale-[1.01]">
      <CardHeader className="text-center pb-4 pt-6 bg-[#d04f99] text-[#fff] rounded-t-3xl">
        <CardTitle className="text-4xl font-extrabold text-[#fff] tracking-tight">
          Forest Focus
        </CardTitle>
        <CardDescription className="text-md text-[#fff]/80 mt-1">
          Plant a tree with your focus!
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-8 p-6">
        {/* Tree Visual */}
        <div className="h-28 flex items-center justify-center">
          {getTreeIcon(progressPercentage, isRunning, isSessionCompleted)}
        </div>

        {/* Task Input */}
        <div className="w-full">
          <Input
            placeholder="What are you focusing on?"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="text-center text-lg py-6 rounded-2xl bg-[#fdedc9] border-[#d04f99]/30 focus:border-[#d04f99] focus:ring-[#d04f99] shadow-sm"
            disabled={isRunning}
          />
        </div>

        {/* Timer Display */}
        <div className="text-8xl font-extrabold tabular-nums text-[#d04f99] tracking-tighter">
          {formatTime(timeRemaining)}
        </div>

        {/* Duration Slider */}
        <div className="w-full px-4 space-y-2">
          <div className="flex justify-between text-sm font-medium text-[#d04f99]">
            <span>Focus Duration:</span>
            <span>{formatTime(sessionDuration)}</span>
          </div>
          <Slider
            min={15}
            max={60}
            step={5}
            value={[sessionDuration / 60]}
            onValueChange={handleSliderChange}
            className="[&>span:first-child]:h-2 [&>span:first-child]:bg-[#d04f99]/20 [&>span:first-child]:rounded-full [&>span:first-child>span]:bg-[#d04f99] [&>span:first-child>span]:rounded-full"
            thumbClassName="[&>span]:w-5 [&>span]:h-5 [&>span]:bg-[#d04f99] [&>span]:border-2 [&>span]:border-white [&>span]:shadow-md"
            disabled={isRunning}
            aria-label="Focus duration slider"
            aria-valuetext={`Focus duration is ${sessionDuration / 60} minutes`}
          />
        </div>

        {/* Main Controls */}
        <div className="flex gap-4 w-full justify-center">
          <Button
            onClick={isRunning ? handlePause : handleStartFocus}
            className={`flex-1 py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-shadow rounded-2xl ${
              isRunning
                ? "bg-red-500"
                : "bg-[#d04f99] text-white hover:bg-[#d04f99]/90"
            }`}
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? (
              <>
                <Pause className="mr-2 h-5 w-5" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" /> Start Focus
              </>
            )}
          </Button>
          <Button
            onClick={handleReset}
            className="flex-1 py-3 text-lg font-semibold bg-[#fdedc9] text-[#d04f99] border border-[#d04f99] hover:bg-[#d04f99]/10 rounded-2xl"
            variant="outline"
          >
            <RotateCcw className="mr-2 h-5 w-5" /> Reset
          </Button>
        </div>

        {/* Trees Planted */}
        <div className="w-full text-center mt-4">
          <span className="text-lg font-medium text-[#d04f99]">
            Trees Planted: {treesPlanted}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
