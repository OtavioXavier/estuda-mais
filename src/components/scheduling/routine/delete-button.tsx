"use client";

import { CircleX, LoaderCircle } from "lucide-react";
import axios from "axios";

import { useToast } from "../../ui/use-toast";
import { useState } from "react";
import { Matter } from '@prisma/client';

interface ButtonProps {
  matter: Matter;
  dayWeek: number,
  reload: () => void;
}

export default function DeleteButton({ matter, reload, dayWeek }: ButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = () => {
    setIsLoading(true);
    const newMatter = {...matter, studyDays: matter.studyDays.filter(day => day !== dayWeek) }
    axios
      .put(`/api/matter/${matter.id}`, {matter: newMatter})
      .then((response) => {
        if (response.data.status === 200) {
          toast({
            title: "matter was deleted",
            description: "matter was deleted with success",
          });
        } else {
          toast({
            title: "matter wasn't deleted",
            description: "matter wasn't deleted with success",
            variant: "destructive",
          });
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false)
        reload();
      });
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleDelete}
      className="text-red-600 p-0 m-0"
    >
      {!isLoading ? (
        <>
          <CircleX />
        </>
      ) : (
        <LoaderCircle color="#222222" className='animate-spin'/>
      )}
    </button>
  );
}
