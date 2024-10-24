"use client";

import CardTarget from "@/components/target/target-card";
import { Target } from "@prisma/client";
import axios from "axios";
import { useState } from "react";

import useSWR, { Fetcher } from "swr";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const fetcher: Fetcher<Target[], string> = (url: string) =>
  axios.get(url).then((res) => res.data.data);

export default function TargetList() {
  const { data, error, mutate } = useSWR(
    "/api/target",
    fetcher
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  if (error){
    return (
      <p className="text-base font-normal text-neutral-500">
        Falha ao carregar itens
      </p>
    );}

  if (!data)
    return <p className="text-base font-normal text-neutral-500">Carregando...</p>;

  const targets = data.filter((target) => target.status === true);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = targets.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(targets.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (targets.length === 0) {
    return (
      <div className="grid gap-10">
        <p className="text-sm font-semibold text-neutral-500">
          Ainda não há objetivos.
        </p>
        <Link href={"/target/new"}>
          <Button className="bg-orange-500">Adicionar Objetivo</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="animate-fade-In">
      <div className="mb-11 flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {currentItems.map((target) => {
          return <CardTarget key={target.id} target={target} update={mutate} />;
        })}
      </div>
      <div className="flex justify-between mb-4">
        <Button
          className="w-18"
          onClick={prevPage}
          disabled={currentPage === 1}
        >
          <ChevronLeft />
        </Button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          className="w-18"
          onClick={nextPage}
          disabled={currentPage === totalPages}
        >
          <ChevronRight />
        </Button>
      </div>
      <Link href={"/target/new"}>
        <Button className="bg-orange-500">Adicionar Objetivo</Button>
      </Link>
    </main>
  );
}
