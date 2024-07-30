import Logo from '@/components/logo';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center h-[70vh] animate-fadeIn'>
      <h1 className='text-6xl md:text-9xl font-black'>Welcome to</h1>
      <div className='animate-bounce'>
      <Logo />
      </div>
    </main>
  );
}
