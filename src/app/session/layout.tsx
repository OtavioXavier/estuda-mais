import Link from 'next/link';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex flex-col text-center items-center justify-center  gap-8">
      <Link href={"/session"}><h1 className="animate-fadeIn text-4xl font-black">Session</h1></Link>
      {children}
      </section>
  )
}