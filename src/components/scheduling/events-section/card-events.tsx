"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Event } from "@prisma/client";
import { Trash } from "lucide-react";
import UpdateButton from "./update-button";

interface CardProps {
  event: Event;
  update: () => void;
}

export default function CardEvents({ event, update }: CardProps) {
  const date =
    event.dateSet instanceof Date ? event.dateSet : new Date(event.dateSet);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const dateSetFormatted = `${day}/${month}/${year}`;

  return (
    <Card className="w-80 h-40 p-3  animate-fadeIn">
      <header className="flex items-center justify-between">
        <CardTitle className="text-sm w-48 text-left h-20 flex flex-col gap-2">
          <p className="overflow-ellipsis whitespace-nowrap overflow-hidden">
            {event.title}
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="link" className="justify-start p-0 m-0 mt-2">
                Description
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{event.title}</DialogTitle>
                <DialogDescription>{event.description}</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardTitle>
        <CardDescription className="font-normal">
          {dateSetFormatted}
        </CardDescription>
      </header>
      <main className="flex items-center justify-between mt-4">
        <UpdateButton event={event} update={update} variant="delete">
          <Trash />
        </UpdateButton>
        <UpdateButton event={event} update={update} variant="finish">
          <Button className="bg-orange-500 font-semibold">I did it</Button>
        </UpdateButton>
      </main>
    </Card>
  );
}
