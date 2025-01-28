"use client"
import { useState } from "react";
import { motion } from "framer-motion";
import { useAppSelector } from "@/lib/store/hooks";
import { UserCheck, UserRoundPen,BarChart  } from 'lucide-react';
import ProfileDetals from "@/components/profile/ProfileDetals";



const AdminPage = () => {
	const {user,isAuthenticated} = useAppSelector((state) => state.auth);
	const [activeTab, setActiveTab] = useState("Profile");

	const tabs = [
			{ id: "profile", label: "Profile", icon:  UserCheck, showWhen: isAuthenticated },
			{ id: "manage-users", label: "Manage Users", icon: UserRoundPen, showWhen: (user && user.role === "admin") },
			{ id: "analytics", label: "Analytics", icon: BarChart,showWhen: isAuthenticated },
		]

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
					className='text-3xl font-semibold md:text-4xl md:font-bold mb-8 text-emerald-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					{
						user && user.role === "admin" ? "Admin" : "User"
					} Dashboard
				</motion.h1>

				<div className='flex flex-col md:flex-row md:justify-center mb-8 gap-2'>
					{
						tabs?.filter(tab => tab.showWhen).map(
							tab => (
								<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={`flex items-center px-4 py-2 mx-2 rounded-md transition-colors duration-200 ${
								activeTab === tab.id
									? "bg-emerald-600 text-white"
									: "bg-gray-700 text-gray-300 hover:bg-gray-600"
							}`}
						>
							<tab.icon className='mr-2 h-5 w-5' />
							{tab.label}
						</button>
							)
						)
					}
				</div>
				{activeTab === "profile" && <ProfileDetals />}
				{/* {activeTab === "create" && }
				{activeTab === "products" && <ProductsList />}
				{activeTab === "analytics" && <AnalyticsTab />} */}
			</div>
		</div>
	);
};
export default AdminPage;