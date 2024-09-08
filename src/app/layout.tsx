import type { Metadata } from "next";
import "./globals.css";

import { Inter, Poppins } from "next/font/google";

import Logo from "@/components/logo";
import Footer from "@/components/layout/footer";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Estuda+",
	description: "An amazing web app for students",
	icons: { icon: "./logo.svg" },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className="mx-4 mt-4 md:mx-0 md:mt-0">
			<body
				className={`${inter.className} min-h-screen bg-background antialiased overflow-x-hidden`}
			>
				<header className="md:hidden">
					<Link href="/">
						<Logo />
					</Link>
				</header>
				<Header />
				<section className="mb-40">{children}</section>
				<Toaster />
				<Footer />
			</body>
		</html>
	);
}
