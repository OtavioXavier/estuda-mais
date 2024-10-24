"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
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
          if(response.data.status === HttpStatusCode.BadRequest) throw new Error("Bad Request");
          if(response.data.status === HttpStatusCode.NotFound) throw new Error("Not Found");


          if (response.data.status !== HttpStatusCode.BadRequest && response.data.status !== HttpStatusCode.NotFound) {
            toast({
              title: "🗑Matéria foi deletada🗑",
              description: "Matéria foi deletada com sucesso",
            });
          } 
        })
        .catch((error) => {
          toast({
            title: "🚧Erro🚧",
            description: `Algo deu errado`,
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
              title: "Matéria foi deletada",
              description: "Matéria foi deletada com sucesso",
            });
          } else {
            throw new Error("Bad Request");
          }
        })
        .catch((error) => {
          toast({
            title: "🚧Erro🚧",
            description: `Algo deu errado`,
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
