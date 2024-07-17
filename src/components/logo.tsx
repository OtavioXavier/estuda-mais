import { Book } from 'lucide-react';


export default function Logo() {
  return (
    <div className='flex items-center'>
    <Book color='#F97316' size={24}  strokeWidth={2}/>
    <h1 className='text-orange-500 text-xl font-semibold'>Estuda+</h1>
    </div>
  )
}