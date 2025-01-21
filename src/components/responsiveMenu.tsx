import React from 'react'
import{motion,AnimatePresence} from "framer-motion"
import Link from 'next/link';
interface ResponsiveMenuProps {
  open: boolean;
  setOpen: Function
}

const ResponsiveMenu: React.FC<ResponsiveMenuProps> = ( {open,setOpen}) => {
  const NavbarMenu = [
    {
      id: 1,
      title: "Home",
      link: "/",
    },
    {
      id: 2,
      title: "Dashboard",
      link: "/dashboard",
    },
    {
      id: 3,
      title: "login",
      link: "/login",
    },
  ];
  return (
    <AnimatePresence mode='wait'>
      {
        open && (
          <motion.div 
          initial={{ opacity: 0, x1:100 }}
          animate={{ opacity: 1, x1: 0}}
          exit={{ opacity: 0, x1: 100 }}
          className='absolute top-0 right-0 h-full w-80 bg-anotherMain text-white text-xl font-bold p-10 transition-all duration-1000'
          >
            <div>
          <ul className='uppercase space-y-4'>
            {
              NavbarMenu?.map((item) => (
                <li key={item?.id}>
              <Link onClick={() => setOpen(!open)}  href={item.link}>{item?.title}</Link>
            </li>
              ))
            }
          </ul>
            </div>
          </motion.div>
        )
      }
    </AnimatePresence>
  )
}

export default ResponsiveMenu