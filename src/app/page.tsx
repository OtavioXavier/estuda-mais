import Logo from '@/components/logo';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-center h-[70vh] animate-fadeIn'>
      <h1 className='text-5xl md:text-8xl font-black'>Bem vindo ao</h1>
      <div className='animate-bounce'>
      <Logo />
      </div>
    </main>
  );
}
