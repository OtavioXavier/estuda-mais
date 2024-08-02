"use client";

import { Button } from "@/components/ui/button";
import { Event } from "@prisma/client";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ReactNode, useState } from "react";
import { Trash } from "lucide-react";

interface ButtonProps {
  event: Event;
  update: () => void;
  variant: "finish" | "delete";
}

export default function UpdateButton({
  event,
  update,
  variant,
}: ButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClick = () => {
    setIsLoading(true);
    const newEvent = {
      ...event,
      status: false,
      ...(variant === "finish" ? { finishedAt: new Date() } : {}),
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
        setIsLoading(false);
        update();
      });
  };

  if (variant === "finish") {
    return (
    <Button 
    disabled={isLoading}
    onClick={handleClick} 
    className="bg-orange-500 font-semibold">I did it</Button>
  );
  }

  if (variant === "delete") {
    return (
      <div>
        <Button
          disabled={isLoading}
          variant={"ghost"}
          className="m-0 p-0"
          onClick={handleClick}
        >
          <Trash />
        </Button>
      </div>
    );
  }
}
