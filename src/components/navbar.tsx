"use client";

import React from "react";
import { Baby, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import ResponsiveMenu from "./responsiveMenu";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { userLoggedOut } from "@/lib/store/features/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store/store"; // Import Redux RootState type

interface MenuItem {
  id: number;
  title: string;
  link: string;
  showWhen?: boolean;
}

const Navbar = () => {
  const { user, isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push("/login");
  };

  const NavbarMenu: MenuItem[] = [
    { id: 1, title: "Home", link: "/" },
    { id: 4, title: "Products", link: "/products", showWhen: isAuthenticated },
    { id: 2, title: "Dashboard", link: "/dashboard", showWhen: isAuthenticated },
    { id: 3, title: "Login", link: "/login", showWhen: !isAuthenticated },
  ];

  const [open, setOpen] = React.useState(false);

  return (
    <div className="overflow-x-hidden">
      <nav>
        <div className="container flex justify-between items-center py-8">
          {/* Logo Section */}
          <div className="text-2xl flex items-center gap-2 font-bold py-8 uppercase">
            <Baby />
            <p className="text-main">TTO</p>
            <p>Website</p>
          </div>

          {/* Menu Section */}
          <div className="hidden md:block">
            <ul className="flex items-center">
              {NavbarMenu.filter((item) => item.showWhen !== false).map((item) => (
                <li key={item.id}>
                  <Link
                    className="inline-block py-1 px-3 hover:text-main hover:rotate-12 transition-all font-semibold duration-200"
                    href={item.link}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User & Logout Section */}
          <div className="flex items-center gap-6">
            {(isAuthenticated === true) && (
              <Button
              size={"sm"}
                onClick={handleLogout}
                className="text-white font-semibold w-[50px] sm: duration-200"
                variant={"destructive"}
              >
                Logout
              </Button>
            )}
            <button className="hidden md:block">
              <Avatar>
                <AvatarImage src={user?.photo || "https://github.com/shadcn.png"} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden" onClick={() => setOpen(!open)}>
            <Menu className="text-4xl active:rotate-90 transition-all duration-500" />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Section */}
      <ResponsiveMenu open={open} setOpen={setOpen} isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
    </div>
  );
};

export default Navbar;
