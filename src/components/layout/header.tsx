"use client";

import { BookOpenText, Calendar, Crosshair } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../logo";
import ZenButton from "./zen-button";

const linkList = [
  {
    id: 1,
    path: "/scheduling",
    icon: <Calendar size={20} />,
    title: "Agendamento",
  },
  {
    id: 2,
    path: "/session",
    icon: <BookOpenText size={20} />,
    title: "Sessão",
  },
  {
    id: 3,
    path: "/target",
    icon: <Crosshair size={20} />,
    title: "Objetivos",
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="md:flex items-center gap-8 bg-orange-50 h-12 mb-8 p-2 rounded-b-xl hidden transition-all justify-between pr-8">
      <div className="flex items-center gap-8 ">
        <Link href="/">
          <Logo />
        </Link>
        {linkList.map((link) => {
          if (pathname.includes(link.path)) {
            return (
              <Link
                key={link.id}
                href={link.path}
                className=" text-orange-500 transition-all font-bold"
              >
                {link.title}
              </Link>
            );
          } else {
            return (
              <Link
                key={link.id}
                href={link.path}
                className="hover:text-orange-500 text-neutral-500 transition-all font-semibold"
              >
                {link.title}
              </Link>
            );
          }
        })}
      </div>
      <ZenButton />
    </header>
  );
}
