"use client";

import Events from '@/components/scheduling/events-section/events';
import Routine from '@/components/scheduling/routine/routine';
import Section from '@/components/scheduling/routine/section';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function Scheduling() {
  const [isEvents, setIsEvents] = useState(false);
  const [isRoutine, setIsRoutine] = useState(false);

  function handleClickEvents() {
    setIsEvents(!isEvents);
    setIsRoutine(false);
  }

  function handleClickRoutine() {
    setIsRoutine(!isRoutine);
    setIsEvents(false);
  }

  return (
    <>
      <main>
        <section className="flex flex-col items-start md:items-center gap-4">
          <Calendar
            mode="single"
            selected={new Date()}
            className="rounded-md border"
          />
          <div className='flex items-center gap-4'>
            <Button className={isEvents ? "bg-neutral-200 border-neutral-400" : ""} variant={"outline"} onClick={handleClickEvents}>
              Events
            </Button>
            <Button className={isRoutine ? "bg-neutral-200 border-neutral-400" : ""} variant={"outline"} onClick={handleClickRoutine}>
              Routine
            </Button>
          </div>
        </section>
        <section>
          {isEvents && (
            <Section title="Events">
             <Events />
            </Section>
          )}
          {isRoutine && (
            <Section title="Routine">
              <Routine />
            </Section>
          )}
        </section>
      </main>
    </>
  );
}
