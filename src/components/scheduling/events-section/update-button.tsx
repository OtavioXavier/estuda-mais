"use client";

import { Button } from "@/components/ui/button";
import { Event } from "@prisma/client";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ReactNode, useState } from "react";

interface ButtonProps {
  event: Event;
  update: () => void;
  variant: "finish" | "delete";
  children: ReactNode;
}

export default function UpdateButton({
  event,
  update,
  variant,
  children,
}: ButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = () => {
    setIsLoading(true)
    const newEvent = {
      ...event,
      status: false,
      ...(variant === "delete" ? { finishedAt: new Date() } : {}),
    };

    axios
      .put(`/api/event/${event.id}`, { event: newEvent })
      .then((res) => {
        if (res.data.status === 200) {
          toast({
            title: variant === "delete" ? "Event deleted" : "Event finished",
            description:
              variant === "delete"
                ? "all right not always everything works"
                : "Congratulations you did it",
            variant: variant === "delete" ? "destructive" : "default",
          });
        } else {
          toast({
            title: "Something is wrong",
            variant: "destructive",
          });
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false)
        update()
      })
  };

  return (
    <Button disabled={isLoading} variant={"ghost"} className="m-0 p-0" onClick={handleClick}>
      {children}
    </Button>
  );
}
