"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, Hourglass, CheckCircle } from "lucide-react";

const NOTIFICATION_SOUND_URL = "https://www.soundjay.com/buttons/beep-07.mp3"; // Public domain sound for demo
const CELEBRATION_SOUND_URL = "https://www.soundjay.com/human/applause-8.mp3"; // Celebration sound

interface PomodoroSectionProps {
  activeTaskName: string;
  onTimeUpdate: (mode: "productive" | "break", elapsedSeconds: number) => void;
}

export default function PomodoroSection({
  activeTaskName,
  onTimeUpdate,
}: PomodoroSectionProps) {
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [mode] = useState<"productive" | "break">("productive");
  const [productiveDuration, setProductiveDuration] = useState(25 * 60); // Default 25 min
  const [breakDuration, setBreakDuration] = useState(5 * 60); // Default 5 min
  const [showCelebration, setShowCelebration] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastTickRef = useRef<number>(Date.now());
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const celebrationAudioRef = useRef<HTMLAudioElement | null>(null);

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

  const handleSessionComplete = useCallback(() => {
    setShowCelebration(true);
    if (celebrationAudioRef.current) {
      celebrationAudioRef.current.currentTime = 0;
      celebrationAudioRef.current.play().catch(() => {});
    }
    setTimeout(() => setShowCelebration(false), 2000);
  }, []);

  /* ─────────────────────── controls ───────────────────────── */

  const handleStart = useCallback(() => {
    if (isRunning) return;

    // If timer is at 0, initialize with current mode's duration
    if (timeRemaining === 0) {
      setTimeRemaining(
        mode === "productive" ? productiveDuration : breakDuration
      );
    }

    setIsRunning(true);
    lastTickRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastTickRef.current) / 1000; // in seconds
      lastTickRef.current = now;

      setTimeRemaining((prev) => {
        const newTime = Math.max(0, prev - elapsed);
        onTimeUpdate(mode, elapsed); // Update total time in dashboard

        if (newTime === 0) {
          clearTimerInterval();
          setIsRunning(false);
          playNotificationSound();
          handleSessionComplete();
          // Optionally, auto-switch mode or prompt for next action
        }
        return newTime;
      });
    }, 200); // update 5x/sec for smoothness
  }, [
    isRunning,
    timeRemaining,
    mode,
    productiveDuration,
    breakDuration,
    onTimeUpdate,
    playNotificationSound,
    handleSessionComplete,
  ]);

  const handlePause = useCallback(() => {
    if (!isRunning) return;
    setIsRunning(false);
    clearTimerInterval();
  }, [isRunning]);

  const handleReset = useCallback(() => {
    clearTimerInterval();
    setIsRunning(false);
    setTimeRemaining(
      mode === "productive" ? productiveDuration : breakDuration
    );
  }, [mode, productiveDuration, breakDuration]);

  const handleDurationChange = useCallback(
    (value: number[], type: "productive" | "break") => {
      const newDuration = value[0] * 60; // Convert minutes to seconds
      if (type === "productive") {
        setProductiveDuration(newDuration);
        if (mode === "productive" && !isRunning) {
          setTimeRemaining(newDuration);
        }
      } else {
        setBreakDuration(newDuration);
        if (mode === "break" && !isRunning) {
          setTimeRemaining(newDuration);
        }
      }
    },
    [mode, isRunning]
  );

  /* ────────────────────── clean-up & effects ─────────────────────────── */

  useEffect(() => {
    // Initialize audio element
    audioRef.current = new Audio(NOTIFICATION_SOUND_URL);
    audioRef.current.load(); // Preload the sound
    celebrationAudioRef.current = new Audio(CELEBRATION_SOUND_URL);
    celebrationAudioRef.current.load();
    // Set initial time remaining based on current mode
    setTimeRemaining(
      mode === "productive" ? productiveDuration : breakDuration
    );

    return () => {
      clearTimerInterval();
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (celebrationAudioRef.current) {
        celebrationAudioRef.current.pause();
        celebrationAudioRef.current = null;
      }
    };
  }, [mode, productiveDuration, breakDuration]); // Re-run if mode or durations change

  /* ─────────────────────── derived values ────────────────────────── */
  const currentSessionTotalDuration =
    mode === "productive" ? productiveDuration : breakDuration;
  const progressPercentage =
    currentSessionTotalDuration > 0
      ? ((currentSessionTotalDuration - timeRemaining) /
          currentSessionTotalDuration) *
        100
      : 0;

  /* ───────────────────────── render ───────────────────────── */

  return (
    <div
      className={`flex flex-col items-center gap-8 p-4 bg-[#fdedc9] border-[#d04f99] border shadow-[5px_5px_0px_0px_#d04f99] rounded-3xl ${
        showCelebration ? "animate-pulse" : ""
      }`}
    >
      {/* Current Task Display */}
      <div className="w-full text-center">
        <p className="text-lg text-[#d04f99] font-medium">Current Task:</p>
        <p className="text-2xl font-bold text-[#d04f99] mt-1">
          {activeTaskName}
        </p>
      </div>

      {/* Mode & Timer Display */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-xl font-semibold text-[#d04f99]">
          {mode === "productive" ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <Hourglass className="w-6 h-6 text-blue-600" />
          )}
          <span>
            {mode === "productive" ? "Productive Time" : "Break Time"}
          </span>
        </div>

        <div className="text-8xl font-extrabold tabular-nums text-[#d04f99] tracking-tighter">
          {formatTime(timeRemaining)}
        </div>

        {/* Session Progress Bar */}
        <div className="w-full px-4">
          <Progress
            value={progressPercentage}
            className="h-3 bg-[#d04f99]/20 rounded-full"
          />
          <p className="text-sm text-[#d04f99] text-center mt-2">
            {formatTime(timeRemaining)} of{" "}
            {formatTime(currentSessionTotalDuration)}
          </p>
        </div>
      </div>

      {/* Duration Sliders */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
        <div>
          <div className="flex justify-between text-sm font-medium text-[#d04f99] mb-2">
            <span>Productive Duration:</span>
            <span>{formatTime(productiveDuration)}</span>
          </div>
          <Slider
            min={5}
            max={90}
            step={5}
            value={[productiveDuration / 60]}
            onValueChange={(val) => handleDurationChange(val, "productive")}
            className="[&>span:first-child]:h-2 [&>span:first-child]:bg-[#d04f99]/20 [&>span:first-child]:rounded-full [&>span:first-child>span]:bg-[#d04f99] [&>span:first-child>span]:rounded-full"
            disabled={isRunning}
            aria-label="Productive duration slider"
          />
        </div>
        <div>
          <div className="flex justify-between text-sm font-medium text-[#d04f99] mb-2">
            <span>Break Duration:</span>
            <span>{formatTime(breakDuration)}</span>
          </div>
          <Slider
            min={1}
            max={30}
            step={1}
            value={[breakDuration / 60]}
            onValueChange={(val) => handleDurationChange(val, "break")}
            className="[&>span:first-child]:h-2 [&>span:first-child]:bg-[#d04f99]/20 [&>span:first-child]:rounded-full [&>span:first-child>span]:bg-blue-500 [&>span:first-child>span]:rounded-full"
            disabled={isRunning}
            aria-label="Break duration slider"
          />
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex gap-4 w-full justify-center">
        <Button
          onClick={isRunning ? handlePause : handleStart}
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
    </div>
  );
}
