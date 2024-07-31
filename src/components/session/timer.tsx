"use client";

import { useState, useEffect, useRef } from "react";
import { ClockType } from "./types/types";
import { Button } from "../ui/button";
import { Pause, Play, TimerReset } from "lucide-react";

interface PropTimer {
  type: ClockType;
  totalTime: number;
  restTime: number;
  howManyTimes: number;
  studyTime: number;
}

export default function Timer({
  type,
  studyTime,
  restTime,
  howManyTimes,
  totalTime,
}: PropTimer) {
  const POMODORO_TIME = studyTime * 60;
  const BREAK_TIME = restTime * 60;
  const TOTAL_TIME = totalTime * 60 * 60;

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPomodoro, setIsPomodoro] = useState<boolean>(true);
  const [timeLeft, setTimeLeft] = useState<number>(POMODORO_TIME);
  const [cycleCount, setCycleCount] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (type === "pomodoro") {
        if (isPomodoro) {
          setCycleCount(cycleCount + 1);
        }
        const nextIsPomodoro = !isPomodoro;
        const nextTimeLeft = nextIsPomodoro ? POMODORO_TIME : BREAK_TIME;

        setIsPomodoro(nextIsPomodoro);
        setTimeLeft(nextTimeLeft);

        if (!nextIsPomodoro && cycleCount + 1 === howManyTimes) {
          setIsRunning(false);
          setCycleCount(0);
          setIsPomodoro(true);
          setTimeLeft(POMODORO_TIME);
        }
      } else if (type === "default") {
        setIsRunning(false);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    isRunning,
    timeLeft,
    isPomodoro,
    cycleCount,
    howManyTimes,
    POMODORO_TIME,
    BREAK_TIME,
    type,
  ]);

  useEffect(() => {
    if (type === "pomodoro") {
      setTimeLeft(POMODORO_TIME);
    } else if (type === "default") {
      setTimeLeft(TOTAL_TIME);
    }
  }, [type, POMODORO_TIME, TOTAL_TIME]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    if (type === "pomodoro") {
      setTimeLeft(POMODORO_TIME);
      setCycleCount(0);
    } else if (type === "default") {
      setTimeLeft(TOTAL_TIME);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  if (type === "pomodoro") {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-52 h-52 rounded-full border-4 border-orange-500 grid place-content-center">
          <h1 className="text-3xl font-bold text-neutral-500 selection:bg-orange-200">
            {formatTime(timeLeft)}
          </h1>
        </div>
        <p className="text-lg font-semibold text-neutral-500">
          {isPomodoro ? "Study time..." : "Break pause..."}
        </p>
        <div className="flex items-center justify-content gap-4">
          {isRunning ? (
            <Button className="bg-orange-800" onClick={stopTimer}>
              <Pause />
            </Button>
          ) : (
            <Button className="bg-orange-800" onClick={startTimer}>
              <Play />
            </Button>
          )}

          <Button className="bg-orange-800" onClick={resetTimer}>
            <TimerReset />
          </Button>
        </div>
      </div>
    );
  }

  if (type === "default") {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-52 h-52 rounded-full border-4 border-blue-500 grid place-content-center">
          <h1 className="text-3xl font-bold text-neutral-500 selection:bg-blue-200">
            {formatTime(timeLeft)}
          </h1>
        </div>
        <p className="text-lg font-semibold text-neutral-500">Total Time</p>
        <div className="flex items-center justify-content gap-4">
          {isRunning ? (
            <Button className="bg-blue-800" onClick={stopTimer}>
              <Pause />
            </Button>
          ) : (
            <Button className="bg-blue-800" onClick={startTimer}>
              <Play />
            </Button>
          )}

          <Button className="bg-blue-800" onClick={resetTimer}>
            <TimerReset />
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
