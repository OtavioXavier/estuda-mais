'use client'
 
import { usePathname } from 'next/navigation'

import Link from 'next/link';
import { Calendar, BookOpenText, Crosshair } from 'lucide-react';


const linkList = [
  {
    path: "/Scheduling",
    icon: <Calendar size={28}/>
  },
  {
    path: "/Session",
    icon: <BookOpenText size={28}/>
  },
  {
    path: "/Target",
    icon: <Crosshair size={28}/>
  },
]

export default function NavLinks() {
  const pathname = usePathname()
  return (
    <div className='bg-orange-50 fixed h-16 w-80 left-1/2 transform -translate-x-1/2  flex items-center justify-between p-4 shadow-md rounded-xl'>
    {linkList.map((link => {
      if(pathname === link.path) {
        return <Link href={link.path} className=' text-orange-500 transition-all'>
        {link.icon}
      </Link>
      } else {
        return <Link href={link.path} className='hover:text-orange-500 text-neutral-500 transition-all'>
        {link.icon}
      </Link>
      }

    }))}
    </div>
  )
}