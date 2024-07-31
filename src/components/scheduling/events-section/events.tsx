"use client";

import { Button } from "@/components/ui/button";
import { Event } from "@prisma/client";
import axios from "axios";
import useSWR, { Fetcher } from "swr";
import CardEvents from "./card-events";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const fetcher: Fetcher<Event[], string> = (url: string) =>
  axios.get(url).then((res) => res.data.data);

export default function Events() {
  const { data, error, mutate } = useSWR(
    "http://localhost:3000/api/event",
    fetcher
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  if (error) return <p>Failed to loading events...</p>;
  if (!data) return <p>Loading...</p>;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(data.length / itemsPerPage);

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

  return (
    <div>
      <div className="mb-11 flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
        {currentItems.map((event) => {
          return <CardEvents key={event.id} event={event} update={mutate} />;
        })}
      </div>
      <div className="flex justify-between mb-4">
        <Button className='w-18' onClick={prevPage} disabled={currentPage === 1}>
        <ChevronLeft />
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button className='w-18' onClick={nextPage} disabled={currentPage === totalPages}>
        <ChevronRight />
        </Button>
      </div>
      <Link href={"/scheduling/new-event"}>
        <Button className="bg-orange-500">Add Event</Button>
      </Link>
    </div>
  );
}