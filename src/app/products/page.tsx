"use client";

import { fetcher } from "@/components/admin/GetAllUsers";
import ProductsCard from "@/components/share/ProductsCard"
import {
  url,
} from "@/lib/store/features/api/authApi";
import { CoursePakage } from "@/types/types";
import useSWR from "swr";


const ProductPage = () => {
  const { data, error, isLoading } = useSWR(`${url}/get-all-courses?page=1&limit=10&status=active&sort=-createdAt`, fetcher);
  console.log(data)
  const courses : CoursePakage[] = data?.data?.courses

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: something went wrong</div>
  return (
    <div className="container w-full space-y-20">
      <div className="flex justify-center h-full">
        <h1 className="text-2xl md:text-3xl font-bold text-main">Featured Products</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {
        courses && courses?.map((product) => (
          <ProductsCard key={product._id} product={product} />
        ))
      }
      </div>
    </div>
  )
}

export default ProductPage