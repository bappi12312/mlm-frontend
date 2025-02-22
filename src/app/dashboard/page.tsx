"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/lib/store/hooks";
import { UserCheck, UserRoundPen, BarChart } from "lucide-react";
import ProfileDetals from "@/components/profile/ProfileDetals";
import GetAllUsers from "@/components/admin/GetAllUsers";
import ManageAllProducts from "@/components/manageProducts/ManageAllProducts";
import AffiliateSales from "@/components/affiliates/AffiliateSales";

type TabID = "profile" | "manage-users" | "affiliatesSales" | "manage-products";

interface Tab {
  id: TabID;
  label: string;
  icon: React.ElementType;
  showWhen: boolean;
}

const AdminPage = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<TabID>("profile");

  // Compute tabs only when authentication status is available
  const tabs: Tab[] = [
    { id: "profile", label: "Profile", icon: UserCheck, showWhen: isAuthenticated },
    { id: "manage-users", label: "Manage Users", icon: UserRoundPen, showWhen: user?.role === "admin" },
    { id: "manage-products", label: "Manage Products", icon: UserRoundPen, showWhen: user?.role === "admin" },
    { id: "affiliatesSales", label: "Sales", icon: BarChart, showWhen: isAuthenticated && user?.isAffiliate },
  ].filter((tab) => tab.showWhen) as Tab[];

  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((t) => t.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.h1
          className="text-3xl font-semibold md:text-4xl md:font-bold mb-8 text-emerald-400 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {user?.role === "admin" ? "Admin" : "User"} Dashboard
        </motion.h1>

        {tabs.length > 0 && (
          <div className="flex flex-col md:flex-row md:justify-center mb-8 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <tab.icon className="mr-2 h-5 w-5" />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {activeTab === "profile" && <ProfileDetals />}
        {activeTab === "manage-users" && <GetAllUsers />}
        {activeTab === "manage-products" && <ManageAllProducts />}
        {activeTab === "affiliatesSales" && <AffiliateSales />}
      </div>
    </div>
  );
};

export default AdminPage;
