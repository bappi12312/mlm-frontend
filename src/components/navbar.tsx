"use client"
import React from "react";
import { Baby,Logs } from 'lucide-react';
import Link from "next/link";
import { Button } from "./ui/button";
import ResponsiveMenu from "./responsiveMenu";


const Navbar = () => {
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
  const [open,setOpen] = React.useState(false)
  return (
    <div className="overflow-x-hidden">
      <nav>
        <div className="container flex justify-between items-center py-8">
          {/* logo section  */}
          <div className="text-2xl flex items-center gap-2 font-bold py-8 uppercase">
            <Baby/>
            <p className="text-main">TTO</p>
            <p>Website</p>
          </div>
          {/* menu section  */}
          <div className="hidden md:block">
            <ul className="flex items-center gap-6">
              {
                NavbarMenu?.map((item) => (
                  <li key={item.id}>
                    <Link className="inline-block py-1 px-3 hover:text-main  hover:rotate-12 transition-all font-semibold duration-200" href={item?.link}>{item.title}</Link>
                  </li>
                ))
              }
            </ul>
          </div>
          {/* login button section  */}
          <div>
            <Button className="text-white font-semibold hidden md:block duration-200 " variant={"destructive"}>login</Button>
          </div>
          {/* menu icon */}
          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <Logs  className="text-4xl active:rotate-90 transition-all duration-500 "/>
          </div>
        </div>
      </nav>
      {/* mobile menu section */}
      <ResponsiveMenu open={open} setOpen = {setOpen}/>
    </div>
  );
};

export default Navbar;
