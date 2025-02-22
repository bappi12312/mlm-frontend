"use client";

import React, { useEffect } from "react";
// import SalesCard from '../share/SalesCard'
import { useUserActions } from "@/lib/store/hooks/useUserActions";
import { getAuthFromCookies } from "@/lib/utils/cookieUtils";
import { CoursePakage } from "@/types/types";
import SalesCard from "../share/SalesCard";

const AffiliateSales = () => {
  const { getAffiliateSales } = useUserActions();
  const { user } = getAuthFromCookies();
  const [sales, setSales] = React.useState<CoursePakage[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = (await getAffiliateSales(user?._id)) as {
        data: { sales: CoursePakage[] };
      } | null;
      console.log(res);
      if (res !== null && res.data) {
        setSales(res.data.sales ?? []);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container mx-auto flex justify-center items-center">
      <h1 className="text-3xl font-semibold text-main">Affiliate Sales</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {sales &&
          sales?.map((product) => (
            <SalesCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
};

export default AffiliateSales;
