"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, LoaderCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  title: z.string({required_error: "An event title is required."}).min(3, {message: "An event title is required."}),
  description: z.string({required_error: "An event description is required."}).min(3, {message: "An event description is required."}),
  dateSet: z.date({required_error: "An event date is required."}).min(new Date(), {message: "An event date is required."}),
});

export default function EventForm() {
  const {toast} = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      dateSet: new Date(),
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const newEvent = {
      title:data.title,
      description: data.description,
      dateSet: data.dateSet,
      status: true,
    }
    axios.post("/api/event", {event: newEvent})
    .then((response) => {
    if(response.data.status === 201) {
      toast({
        title: "🥳Sucesso🥳",
        description: "Evento adicionado com sucesso"
      })
      router.push('/scheduling');
    } else {
      toast({
        title: "🚧Erro🚧",
        description: "Something is wrong",
        variant: "destructive",
      })
    }
    })
    .catch((error) => console.error(error))
    .finally(() => {
      setIsLoading(false);
    })
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='flex flex-col gap-8 mt-8 animate-fadeIn'>
          <FormField
            control={form.control}
            name="dateSet"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Data do Evento</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Selecione a data</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date <= new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                  
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Titulo do evento</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o titulo do evento..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start">
                  <FormLabel>Titulo do evento</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Digite a descrição do evento..."
                      className="h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          
          {!isLoading ? <><Button className='bg-orange-500'>Enviar</Button></> : <><Button className='bg-neutral-500 flex items-center gap-4'>Carregando... <LoaderCircle  className='animate-spin'/></Button></>}
        </form>
      </Form>
    </div>
  );
}
