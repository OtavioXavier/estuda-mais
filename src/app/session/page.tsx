"use client";

import FinishedSession from "@/components/session/finished-session";
import MattersListItem from "@/components/session/matters-list-item";
import SelectClock from "@/components/session/select-clock";
import Timer from "@/components/session/timer";
import TopicsList from "@/components/session/topics-list";
import { ClockType } from "@/components/session/types/types";
import { Button } from "@/components/ui/button";
import { Matter, Topic } from "@prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR, { Fetcher } from "swr";

type MatterWithTopics = Matter & { topics: Topic[] };

const fetcher: Fetcher<MatterWithTopics[], string> = (url: string) =>
  axios.get(url).then((res) => res.data.data);

export default function Session() {
  const [isStart, setIsStart] = useState(false);
  const [isFinish, setIsFinish] = useState(false);
  const [clockType, setClockType] = useState<ClockType>("default");
  const [times, setTimes] = useState({
    totalTime: 0,
    restTime: 0,
    howManyTimes: 0,
    studyTime: 0,
  });

  const { data, error, mutate } = useSWR(
    `/api/matter`,
    fetcher
  );

  useEffect(() => {
    setTimes({ totalTime: 0, restTime: 0, howManyTimes: 0, studyTime: 0 });
  }, [clockType]);

  const handleSelectValue = (newValue: ClockType) => setClockType(newValue);

  const handleStart = () => setIsStart((prev) => !prev);

  const handleFinish = () => {
    if(isFinish) {
      setIsStart(false);
      setIsFinish(false)
      window.location.reload();
    } else {
      setIsFinish(true)
    }
  };

  const handleTimeChange = (field: keyof typeof times) => (newTime: number) =>
    setTimes((prev) => ({ ...prev, [field]: newTime }));

  const isButtonDisabled = () => {
    const { studyTime, restTime, howManyTimes, totalTime } = times;
    return clockType === "pomodoro"
      ? studyTime <= 0 || restTime <= 0 || howManyTimes <= 0
      : totalTime <= 0;
  };

  return (
    <section>
      <header className="text-start mb-11">
        <h2 className="font-semibold text-lg">
          {!isStart
            ? "Bem vindo, vamos começar uma sessão?"
            : "Tópicos para hoje:"}
        </h2>
        <p className="text-neutral-500 text-sm md:text-base">
          Primeiro, você precisa adicionar tópicos e selecionar um cronometro:
        </p>
      </header>
      <div>
        {!data ? (
          <p className="text-base font-normal text-neutral-500">Carregando...</p>
        ) : error ? (
          <p className="text-base font-normal text-neutral-500">
            Falhou ao carregar itens
          </p>
        ) : null}
      </div>
      {!isStart && data && (
        <>
          {data
            .filter((matter) => matter.studyDays.includes(new Date().getDay()))
            .map((matter) => (
              <MattersListItem
                key={matter.id}
                matter={matter}
                update={mutate}
              />
            ))}
          <SelectClock
            setClock={handleSelectValue}
            setTotalTime={handleTimeChange("totalTime")}
            setHowManyTimes={handleTimeChange("howManyTimes")}
            setRestTime={handleTimeChange("restTime")}
            clockType={clockType}
            setStudyTime={handleTimeChange("studyTime")}
          />
        </>
      )}
      {isStart && data && (
        <>
          {isFinish ? (
            <>
              <FinishedSession
                topics={data
                  .filter((matter) =>
                    matter.studyDays.includes(new Date().getDay())
                  )
                  .flatMap((matter) => {
                    return matter.topics;
                  })}
              />
            </>
          ) : (
            <div className="animate-fadeIn">
              <TopicsList
                matters={data
                  .filter((matter) =>
                    matter.studyDays.includes(new Date().getDay())
                  )
                  .map((matter) => {
                    return matter;
                  })}
              />
              <Timer
                type={clockType}
                totalTime={times.totalTime}
                restTime={times.restTime}
                howManyTimes={times.howManyTimes}
                studyTime={times.studyTime}
              />
            </div>
          )}
        </>
      )}
      {isStart ? (
        <Button
          disabled={isButtonDisabled()}
          className="bg-orange-500 mt-11"
          onClick={handleFinish}
        >
          Terminar
        </Button>
      ) : (
        <Button
          disabled={isButtonDisabled()}
          className="bg-orange-500 mt-11"
          onClick={handleStart}
        >
          Começar
        </Button>
      )}
    </section>
  );
}
