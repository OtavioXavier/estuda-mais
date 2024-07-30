"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Matter } from "@prisma/client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { useToast } from "../../ui/use-toast";

import { Check, GraduationCap } from "lucide-react";
import { DialogClose } from "../../ui/dialog";
import axios from "axios";
import { useState } from "react";

interface PropsForm {
  mattersList?: Matter[];
  day: number;
  update: () => void;
}

export default function CreateMatterForm({
  mattersList = [],
  day,
  update,
}: PropsForm) {
  const mattersNames = mattersList.map((matter) => {
    return matter.name;
  });
  const dayMattersNames = mattersList
    .filter((matter) => matter.studyDays.includes(day))
    .map((matter) => matter.name);

  const formSchema = z.object({
    selectedMatter: z.string(),
    newMatter: z.string().optional(),
  });

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedMatter: "",
      newMatter: "",
    },
  });

  const matterType = form.watch("selectedMatter");
  const matterNew = form.watch("newMatter");

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (data.selectedMatter !== "new") {
      const matter = mattersList.find((m) => m.name === data.selectedMatter);
      if (matter) await uploadMatter(matter);
      console.log(matter);
    } else if (data.newMatter) {
      await uploadMatter(undefined, data.newMatter);
    }
  };

  const uploadMatter = async (matter?: Matter, matterName?: string) => {
    setIsLoading(true);
    try {
      if (matter) {
        matter.studyDays = [...(matter.studyDays || []), day];
        await axios.put(`/api/matter/${matter.id}`, { matter: matter });
        toast({
          title: "Matter updated",
          description: "Your matter was added to the new day",
        });
      } else if (matterName) {
        const newMatter = { name: matterName, status: true, studyDays: [day] };
        await axios.post(`/api/matter`, { matter: newMatter });
        toast({
          title: "Matter created",
          description: "Your matter was added to the new day",
        });
      }
    } catch (error) {
      toast({
        title: `Error on matter ${matter ? "update" : "creation"}`,
        description: "Server issue, your matter wasn't processed",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
      update();
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="grid grid-flow-row place-content-center gap-4"
        >
          <FormField
            control={form.control}
            name="selectedMatter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select a new matter</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select a matter" />
                    </SelectTrigger>
                    <SelectContent>
                      {mattersList.map((matter) => (
                        <SelectItem key={matter.id} value={matter.name}>
                          {matter.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">New matter</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {matterType === "new" && (
            <div className="animate-fadeIn">
              <FormField
                control={form.control}
                name="newMatter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Write your new matter</FormLabel>
                    <FormControl>
                      <Input
                        className="w-[200px]"
                        placeholder="My new matter"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-8">
            <Button
              disabled={
                isLoading ||
                matterType === "" ||
                (matterType === "new" && matterNew === "")
              }
              className="flex items-center justify-content gap-4"
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  Add matter <GraduationCap />
                </>
              )}
            </Button>
            <DialogClose asChild>
              <Button className="flex items-center justify-content gap-4">
                Done <Check />
              </Button>
            </DialogClose>
          </div>
        </form>
      </Form>
    </div>
  );
}
