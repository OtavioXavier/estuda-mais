import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import axios from "axios";
import { Target } from "@prisma/client";

interface CardProps {
  target: Target;
  update: () => void;
}

export default function CardTarget({target, update}: CardProps) {

  const { toast } = useToast()

  async function handleFinish() {
    const updatedTarget = { ...target, status: false };
    axios
      .put(`http://localhost:3000/api/target/${target.id}`, {
        target: updatedTarget,
      })
      .then(()=> {
        toast({
          title: "Target: target is finish",
          description: "🎉 congratulations you are impressive",
        })
      })
      .catch((error) => console.log(error))
      .finally(() => update())
  }

  async function handleDelete() {
    axios
      .delete(`http://localhost:3000/api/target/${target.id}`)
      .then(() => {
        toast({
          title: "Target: target is delete",
          description: "😞 It's okay, it wasn't meant to be",
          variant: "destructive",
        })
      })
      .catch((error) => console.log(error))
      .finally(() => update())

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
        <CardTitle className="text-sm w-48 text-left h-10">{target.title}</CardTitle>
        <CardDescription className='font-normal'>{deadlineFormatted}</CardDescription>
      </header>
      <main className="flex items-center justify-between mt-4">
        <Button variant={"ghost"} className="text-orange-500 p-0" onClick={handleDelete}>
          <Trash />
        </Button>
        {target.subjectTarget && (
          <p className="text-sm">
            <span className="text-neutral-500">{target.subjects}/</span>
            {target.subjectTarget}
          </p>
        )}
        {!target.subjectTarget && (
          <Button className="bg-orange-500 font-semibold" onClick={handleFinish}>
            I did it
          </Button>
        )}
      </main>
    </Card>
  );
}
