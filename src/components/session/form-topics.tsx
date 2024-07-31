"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Matter } from "@prisma/client";

import { useToast } from '../ui/use-toast';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "../ui/button";

import { CirclePlus } from "lucide-react";
import { Input } from "../ui/input";
import axios from 'axios';
import { useState } from 'react';

const FormSchema = z.object({
  topic: z.string().min(2, {
    message: "Topic must be at least 2 characters.",
  }),
});

interface FormProps {
  matter: Matter;
  update: () => void;
}

export default function FormTopics({ matter, update }: FormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topic: "",
    },
  });

  function handleSubmit(values: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    const newTopic = {
        title: values.topic,
        matterId: matter.id,
    }
    axios.post("/api/topic", {topic: newTopic})
    .then((res) => {
     if(res.data.status == 201) {
       toast({
        title: "Success",
        description: `A new topic is added to ${matter.name}`
       })
     }

    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      setIsLoading(false)
      update();
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-orange-500 flex items-center gap-4">
          Add <CirclePlus />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="sm:max-w-[425px]">
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="p-1 space-y-6"
            >
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Type your topic..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Type your new {matter.name}'s topic.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isLoading} type="submit" className='bg-orange-500'>Submit</Button>
            </form>
          </Form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
