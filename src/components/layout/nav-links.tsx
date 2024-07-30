'use client'
 
import { usePathname } from 'next/navigation'

import Link from 'next/link';
import { Calendar, BookOpenText, Crosshair } from 'lucide-react';


const linkList = [
  {
    id: 1,
    path: "/scheduling",
    icon: <Calendar size={28}/>
  },
  {
    id: 2,
    path: "/session",
    icon: <BookOpenText size={28}/>
  },
  {
    id: 3,
    path: "/target",
    icon: <Crosshair size={28}/>
  },
]

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <div className='bg-orange-50 fixed h-16 w-80 left-1/2 transform -translate-x-1/2 bottom-8 flex items-center justify-between p-4 shadow-md rounded-t-xl'>
    {linkList.map((link => {
      if(pathname.includes(link.path)) {
        return <Link key={link.id} href={link.path} className=' text-orange-500 transition-all hover:animate-bounce'>
        {link.icon}
      </Link>
      } else {
        return <Link key={link.id} href={link.path} className='hover:text-orange-500 text-neutral-500 transition-all hover:animate-bounce'>
        {link.icon}
      </Link>
      }

    }))}
    </div>
  )
}