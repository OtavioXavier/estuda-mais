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
import { UpdateMatterDto } from "@/dto/update-matter.dto";
import { CreateMatterDto } from "@/dto/create-matter.dto";

interface PropsForm {
  mattersList?: Matter[];
  day: number;
  update: () => void;
}

const createFormSchema = (existingMatterNames: string[]) => z.object({
  selectedMatter: z.string().nonempty("Select a matter"),
  newMatter: z.string().optional().refine((newMatter) => {
    if (!newMatter) return true;
    return !existingMatterNames.includes(newMatter);
  }, {
    message: "This matter already exists.",
  }),
});

export default function CreateMatterForm({
  mattersList = [],
  day,
  update,
}: PropsForm) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const existingMatterNames = mattersList.map((matter) => matter.name);
  
  const formSchema = createFormSchema(existingMatterNames);

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
    setIsLoading(true);
    try {
      if (data.selectedMatter !== "new") {
        const matter = mattersList.find((m) => m.name === data.selectedMatter);
        if (matter) {
          await uploadMatter(matter);
        }
      } else if (data.newMatter) {
        await uploadMatter(undefined, data.newMatter);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      update();
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  };

  const uploadMatter = async (matter?: Matter, matterName?: string) => {
    try {
      if (matter) {
        const updatedMatter: UpdateMatterDto = {
          studyDays: [...(matter.studyDays || []), day],
          name: matter.name,
          status: matter.status,
        };
        const res = await axios.put(`/api/matter/${matter.id}`, updatedMatter);
        if (res.status !== 400) {
          toast({
            title: "Matter updated",
            description: "Your matter has been added to the new day.",
          });
        } else {
          throw new Error("Bad Request");
        }
      } else if (matterName) {
        const newMatter: CreateMatterDto = {
          name: matterName,
          status: true,
          studyDays: [day],
        };
        const res = await axios.post(`/api/matter`, newMatter);
        if (res.status !== 400) {
          toast({
            title: "Matter created",
            description: "Your matter has been added to the new day.",
          });
        } else {
          throw new Error("Bad Request");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: `An error occurred: ${error.message}`,
        variant: "destructive",
      });
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
              type="submit"
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  Add matter <GraduationCap />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
