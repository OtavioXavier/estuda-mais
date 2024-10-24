"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios, { HttpStatusCode } from "axios";
import { useState } from "react";

export default function newTarget() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formSchema = z
    .object({
      title: z
        .string({ required_error: "Um titulo é obrigatório" })
        .min(3, { message: "Um titúlo precisa ter pelo menos 3 caracteres" }),
      deadline: z.date({ required_error: "Uma data final é obrigatória" }),
      type: z.enum(["to do", "subjects"], {
        required_error: "Um tipo é obrigatório",
      }),
      subjects: z.preprocess((value) => {
        return Number(value);
      }, z.number().positive().nonnegative().optional()),
    })
    .refine(
      (data) => {
        if (data.type === "subjects") {
          return !!data.subjects;
        }
        return true;
      },
      {
        message: "Quantidade de taferas é exigida neste tipo",
        path: ["subjects"],
      }
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      deadline: new Date(),
      type: "to do",
      subjects: 1,
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    axios
      .post("/api/target", { ...data })
      .then((res) => {
        if (res.data.status === HttpStatusCode.Created) {
          toast({
            title: "🎉 Parabéns 🎉",
            description: "Objetivo criado, você estabeleceu uma meta",
          });
          router.push("/target");
        }

        if (res.data.status === HttpStatusCode.BadRequest)
          throw new Error("Bad Request");
      })
      .catch((error) => {
        console.error(error);
        toast({
          title: "🚧Erro🚧",
          description: `Algo deu errado`,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const targetType = form.watch("type");

  return (
    <section>
      <Form {...form}>
        <form
          className="flex flex-col gap-6"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-xl font-semibold">Título</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none font-normal"
                      placeholder="Digite o título do seu objetivo"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col items-start">
                  <FormLabel className="text-xl font-semibold">
                    Data final
                  </FormLabel>
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
                              <span>Selecione uma data</span>
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
                          disabled={(date) => date < new Date()}
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
            name="type"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel className="text-xl font-semibold">Título</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="to do" />
                      </FormControl>
                      <FormLabel className="font-normal">Pendência</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="subjects" />
                      </FormControl>
                      <FormLabel className="font-normal">Atividades</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {targetType === "subjects" && (
            <FormField
              control={form.control}
              name="subjects"
              render={({ field }) => {
                return (
                  <FormItem className="flex flex-col items-start transition-all">
                    <FormLabel className="text-xl font-semibold">
                      Quantidade de atividades
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="font-normal"
                        type="number"
                        placeholder={"120"}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
          <Button disabled={isLoading} type="submit" className="bg-orange-500">
            {!isLoading ? "Enviar" : "Carregando..."}
            {isLoading ? <Loader2 className="animate-spin ml-3" /> : ""}
          </Button>
        </form>
      </Form>
    </section>
  );
}
