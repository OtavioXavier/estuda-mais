import type { Metadata } from "next";
import "./globals.css";

import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import Logo from '@/components/logo';
import Footer from '@/components/layout/footer';
import Link from 'next/link';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/header';

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Estuda+",
  description: "an amazing web app for students",
  icons: { icon: "./logo.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className='mx-4 mt-4 md:mx-0 md:mt-0'>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased overflow-x-hidden",
          fontSans.variable,
        )}
      >
      <header className='md:hidden'>
        <Link href="/">
        <Logo />
        </Link>
      </header>
      <Header />
      <section className='mb-40'>
        {children}
      </section>
      <Toaster />
      <Footer />
      </body>
    </html>
  );
}
