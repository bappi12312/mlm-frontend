import { url } from "@/lib/store/features/api/authApi";
import React from "react";
import { fetcher } from "../admin/GetAllUsers";
import useSWR from "swr";
import ProductsTable from "../share/ProductsTable";

const GetAllProduct = () => {
  const { data, error, isLoading } = useSWR(
    `${url}/get-all-courses?page=1&limit=10&status=active&sort=-createdAt`,
    fetcher
  );

  const courses = data?.data?.courses;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: error while getting all users</div>;
  return (
    <div>
      <ProductsTable
        data={courses || []}
        heading={["Name", "Status", "Category", "Price", "Action"]}
      />
    </div>
  );
};

export default GetAllProduct;
