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
      <Label>Tipo de Cronometro</Label>
      <Select onValueChange={setClock} defaultValue='default'>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione o tipo de cronometro" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Tipo de Cronometro</SelectLabel>
            <SelectItem value="pomodoro">Pomodoro</SelectItem>
            <SelectItem value="default">Padrão</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {clockType === "pomodoro" && (
        <>
          <div className="flex flex-col items-start gap-4 mt-4">
            <Label>Tempo de Estudo (Minutos)</Label>
            <Input
              placeholder="25"
              type="number"
              onChange={(e) => setStudyTime(Number(e.target.value))}
              className="w-32"
            />
            <p className="text-sm text-neutral-500">
              Por quanto tempo você vai estudar, em minutos?
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 mt-4">
            <Label>Tempo de Descanso (Minutos)</Label>
            <Input
              placeholder="5"
              type="number"
              onChange={(e) => setRestTime(Number(e.target.value))}
              className="w-32"
            />
            <p className="text-sm text-neutral-500">
              Por quanto tempo você vai descansar, em minutos?
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 mt-4">
            <Label>Repetições</Label>
            <Input
              placeholder="2"
              type="number"
              onChange={(e) => setHowManyTimes(Number(e.target.value))}
              className="w-32"
            />
            <p className="text-sm text-neutral-500">
              Quantas vezes o cronometro deve se repetir?
            </p>
          </div>
        </>
      )}
      {clockType === "default" && (
        <div className="flex flex-col items-start gap-4 mt-4">
        <Label>Tempo de Estudo (Horas)</Label>
        <Input
          placeholder="2"
          type="number"
          onChange={(e) => setTotalTime(Number(e.target.value))}
          className="w-32"
        />
        <p className="text-sm text-neutral-500">
          Quanto tempo você vai estudar, em horas?
        </p>
      </div>
      )}
    </div>
  );
}
