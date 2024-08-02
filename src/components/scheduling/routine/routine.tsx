"use client";

import axios from "axios";
import useSWR, { Fetcher } from "swr";
import { Matter } from "@prisma/client";

import { useState } from "react";

import { GraduationCap, Pencil } from "lucide-react";

import { Button } from "../../ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import CreateMatterForm from "./create-matter-form";
import DeleteButton from "./delete-button";

const fetcher: Fetcher<Matter[], string> = (url: string) =>
  axios.get(url).then((res) => res.data.data);

export default function Routine() {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const daysOfWeek = [
    { name: "Sunday", dayNumber: 0 },
    { name: "Monday", dayNumber: 1 },
    { name: "Tuesday", dayNumber: 2 },
    { name: "Wednesday", dayNumber: 3 },
    { name: "Thursday", dayNumber: 4 },
    { name: "Friday", dayNumber: 5 },
    { name: "Saturday", dayNumber: 6 },
  ] as const;

  const { data, error, mutate } = useSWR(
    "http://localhost:3000/api/matter",
    fetcher
  );

  if (error) return <div>Failed to load matters</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <div className="md:grid md:grid-cols-4 gap-4">
        {daysOfWeek.map((weekDay) => {
          return (
            <div key={weekDay.dayNumber} className="flex flex-col gap-5 mb-12 ">
              <Table className="w-36 ">
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-black">
                      {weekDay.name}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data
                    .filter(
                      (matter) =>
                        matter.status === true &&
                        matter.studyDays.includes(weekDay.dayNumber)
                    )
                    .map((matter, index) => {
                      return (
                        <TableRow
                          key={matter.id}
                          className={
                            index % 2 === 0
                              ? "bg-orange-500 text-white hover:bg-orange-300 hover:text-neutral-600 font-semibold p-1 flex border-b-orange-500 border-b-2 justify-between items-center "
                              : "font-semibold p-1 flex border-b-orange-500 border-b-2 justify-between items-center "
                          }
                        >
                          <TableCell className="flex items-center gap-4 h-6">
                            {matter.name}
                          </TableCell>
                          <TableCell className="flex items-center gap-4 h-6">
                            {isEditing && (
                              <DeleteButton
                                dayWeek={weekDay.dayNumber}
                                matter={matter}
                                reload={mutate}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
              {isEditing && (
                <>
                  <div className="block md:hidden">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex items-center gap-4 animate-fadeIn bg-orange-500 hover:bg-orange-400">
                          Add Matter
                          <GraduationCap />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Add a matter to {weekDay.name}
                          </DialogTitle>
                          <DialogDescription>
                            Add a new matter in you routine.
                          </DialogDescription>
                        </DialogHeader>
                        <CreateMatterForm
                          mattersList={data}
                          day={weekDay.dayNumber}
                          update={mutate}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="md:block hidden">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="flex items-center gap-4 animate-fadeIn bg-orange-500 hover:bg-orange-400">
                          Add Matter
                          <GraduationCap />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <CreateMatterForm
                          mattersList={data}
                          day={weekDay.dayNumber}
                          update={mutate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <Button
        className="flex items-center gap-2"
        onClick={() => setIsEditing(!isEditing)}
      >
        <Pencil size={16} /> {isEditing ? "Save" : "Edit"}
      </Button>
    </div>
  );
}
