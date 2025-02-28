import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface ResponsiveMenuProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAuthenticated: boolean;
}

interface MenuItem {
  id: number;
  title: string;
  link: string;
  showWhen?: boolean;
}

const ResponsiveMenu: React.FC<ResponsiveMenuProps> = ({ open, setOpen, isAuthenticated }) => {
  const NavbarMenu: MenuItem[] = [
    { id: 1, title: "হোম", link: "/" },
    { id: 4, title: "পণ্য", link: "/products", showWhen: isAuthenticated },
    { id: 2, title: "ড্যাশবোর্ড", link: "/dashboard", showWhen: isAuthenticated },
    { id: 3, title: "লগইন", link: "/login", showWhen: !isAuthenticated },
  ];

  return (
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          className="absolute top-0 right-0 h-full w-80 bg-anotherMain text-white text-xl font-bold p-10 transition-all duration-1000"
        >
          <div>
            <ul className="uppercase space-y-4">
              {NavbarMenu.filter((item) => item.showWhen !== false).map((item) => (
                <li key={item.id}>
                  <Link onClick={() => setOpen((prev) => !prev)} href={item.link}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResponsiveMenu;