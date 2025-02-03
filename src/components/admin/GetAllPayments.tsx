"use client"

import { useGetAllPaymentsQuery } from "@/lib/store/features/api/authApi"


const GetAllPayments = () => {
  const {data: paymentData,isLoading,isError} = useGetAllPaymentsQuery({})

  const paymentLength = paymentData?.data?.payments?.length
  if (isLoading) return <div className="text-center text-3xl flex justify-center items-center text-main">Loading...</div>;
  if (isError) return <div>Error: something went worng to getAll users</div>;

  return (
    <div>GetAllPayments: {paymentLength}</div>
  )
}

export default GetAllPayments