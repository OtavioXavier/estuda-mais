"use client";

import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import axios, { HttpStatusCode } from "axios";
import { Target } from "@prisma/client";
import { useState } from "react";
import { UpdateTargetDto } from "@/dto/update-target.dto";

interface CardProps {
  target: Target;
  update: () => void;
}

export default function CardTarget({ target, update }: CardProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinishing, setIsFinishing] = useState<boolean>(false);

  const { toast } = useToast();

  async function handleFinish() {
    setIsFinishing(true)
    const updatedTarget: UpdateTargetDto = {
      status: false,
      finishedAt: new Date(),
    };
    axios
      .put(`/api/target/${target.id}`, {
        ...updatedTarget,
      })
      .then((res) => {
        if (res.data.status != HttpStatusCode.BadRequest) {
          toast({
            title: "Target: target is finish",
            description: "🎉 congratulations you are impressive 🎉",
          });
        }

        if (res.data.status === HttpStatusCode.BadRequest)
          throw new Error("Bad Request");
        if (res.data.status === HttpStatusCode.NotFound)
          throw new Error("Not Found");
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: `Something is wrong. Error:${error}`,
          variant: "destructive",
        });
      })
      .finally(() => {
        update();
        setIsFinishing(false)
      });
  }

  async function handleDelete() {
    setIsLoading(true);
    axios
      .delete(`/api/target/${target.id}`)
      .then(() => {
        toast({
          title: "Target: target is delete",
          description: "😞 It's okay, it wasn't meant to be",
          variant: "destructive",
        });
        update();
      })
      .catch((error) => console.log(error))
      .finally(() => {
        update();
        setIsLoading(false);
      });
  }

  const date =
    target.deadline instanceof Date
      ? target.deadline
      : new Date(target.deadline);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const deadlineFormatted = `${day}/${month}/${year}`;

  return (
    <Card className="w-80 h-28 p-3 animate-fadeIn">
      <header className="flex items-center justify-between">
        <CardTitle className="text-sm w-48 text-left h-10">
          {target.title}
        </CardTitle>
        <CardDescription className="font-normal">
          {deadlineFormatted}
        </CardDescription>
      </header>
      <main className="flex items-center justify-between mt-4">
        <Button
          disabled={isLoading}
          variant={"ghost"}
          className="text-red-800 hover:text-red-600 p-0"
          onClick={handleDelete}
        >
          {!isLoading ? <Trash /> : <Loader2 className="animate-spin" />}
        </Button>
        {target.subjectTarget && (
          <p className="text-sm">
            <span className="text-neutral-500">{target.subjects}/</span>
            {target.subjectTarget}
          </p>
        )}
        {!target.subjectTarget && (
          <Button
            className={`bg-orange-500 font-semibold ${isFinishing ? "animate-pulse" : ""}`}
            onClick={handleFinish}
            disabled={isFinishing}
          >
            I did it
          </Button>
        )}
      </main>
    </Card>
  );
}
