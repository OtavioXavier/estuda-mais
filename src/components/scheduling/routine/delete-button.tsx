"use client";

import { CircleX, LoaderCircle, Trash2 } from "lucide-react";
import axios, { HttpStatusCode } from "axios";

import { useToast } from "../../ui/use-toast";
import { useState } from "react";
import { Matter } from "@prisma/client";
import { UpdateMatterDto } from "@/dto/update-matter.dto";

interface ButtonProps {
  matter: Matter;
  dayWeek: number;
  reload: () => void;
}

export default function DeleteButton({ matter, reload, dayWeek }: ButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleDelete = () => {
    setIsLoading(true);

    const newMatter: UpdateMatterDto = {
      name: matter.name,
      status: matter.status,
      studyDays: matter.studyDays.filter((day) => day !== dayWeek),
    };

    if (newMatter.studyDays?.length === 0) {
      axios
        .delete(`/api/matter/${matter.id}`)
        .then((response) => {
          if (response.status != HttpStatusCode.BadRequest) {
            toast({
              title: "matter has been deleted",
              description: "matter has been deleted with success",
            });
          } else {
            throw new Error("Bad Request");
          }
        })
        .catch((error) => {
          toast({
            title: "matter wasn't deleted",
            description: `Error: ${error}`,
            variant: "destructive",
          });
        })
        .finally(() => {
          reload();
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        });
    } else {
      axios
        .put(`/api/matter/${matter.id}`, { ...newMatter })
        .then((response) => {
          if (response.status != HttpStatusCode.BadRequest) {
            toast({
              title: "matter has been deleted",
              description: "matter has been deleted with success",
            });
          } else {
            throw new Error("Bad Request");
          }
        })
        .catch((error) => {
          toast({
            title: "matter wasn't deleted",
            description: `Error: ${error}`,
            variant: "destructive",
          });
        })
        .finally(() => {
          reload();
          setTimeout(() => {
            setIsLoading(false);
          }, 1500);
        });
    }
  };

  return (
    <button
      disabled={isLoading}
      onClick={handleDelete}
      className="text-red-600 p-0 m-2"
    >
      {!isLoading ? (
        <>
          <Trash2 size={20} />
        </>
      ) : (
        <LoaderCircle size={20} color="#222222" className="animate-spin" />
      )}
    </button>
  );
}
