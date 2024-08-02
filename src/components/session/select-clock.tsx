"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";
import { ClockType } from "./types/types";
import { Input } from "../ui/input";

interface SelectProps {
  setClock: (clockType: ClockType) => void;
  clockType: ClockType;
  setTotalTime: (time: number) => void;
  setHowManyTimes: (times: number) => void;
  setRestTime: (time: number) => void;
  setStudyTime: (time: number) => void;
}

export default function SelectClock({
  setClock,
  clockType,
  setTotalTime,
  setHowManyTimes,
  setRestTime,
  setStudyTime,
}: SelectProps) {
  return (
    <div className="flex flex-col items-start gap-4 mt-8">
      <Label>Clock Type</Label>
      <Select onValueChange={setClock} defaultValue='default'>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a clock type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Clock Types</SelectLabel>
            <SelectItem value="pomodoro">Pomodoro</SelectItem>
            <SelectItem value="default">Default</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {clockType === "pomodoro" && (
        <>
          <div className="flex flex-col items-start gap-4 mt-4">
            <Label>Study Time</Label>
            <Input
              placeholder="25"
              type="number"
              onChange={(e) => setStudyTime(Number(e.target.value))}
              className="w-32"
            />
            <p className="text-sm text-neutral-500">
              Type how many time you study
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 mt-4">
            <Label>Rest Time</Label>
            <Input
              placeholder="5"
              type="number"
              onChange={(e) => setRestTime(Number(e.target.value))}
              className="w-32"
            />
            <p className="text-sm text-neutral-500">
              Type how many time your break time
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 mt-4">
            <Label>How Many times</Label>
            <Input
              placeholder="2"
              type="number"
              onChange={(e) => setHowManyTimes(Number(e.target.value))}
              className="w-32"
            />
            <p className="text-sm text-neutral-500">
              Type how many times repeat...
            </p>
          </div>
        </>
      )}
      {clockType === "default" && (
        <div className="flex flex-col items-start gap-4 mt-4">
        <Label>Study Time</Label>
        <Input
          placeholder="2"
          type="number"
          onChange={(e) => setTotalTime(Number(e.target.value))}
          className="w-32"
        />
        <p className="text-sm text-neutral-500">
          Type how many time you study in hours.
        </p>
      </div>
      )}
    </div>
  );
}
