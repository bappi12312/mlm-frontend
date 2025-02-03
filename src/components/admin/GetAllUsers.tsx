"use client";

import {
  useGetAllPaymentsQuery,
  useGetAllUsersQuery,
} from "@/lib/store/features/api/authApi";
import List from "../share/List";
import { UsersTable } from "../share/UsersTable";

const GetAllUsers = () => {
  const { data, isLoading, isError } = useGetAllUsersQuery({});

  const {
    data: paymentData,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
  } = useGetAllPaymentsQuery({});

  const length = data?.data?.users?.length;
  const paymentLength = paymentData?.data?.payments?.length;
  if (isLoading && isPaymentLoading)
    return (
      <div className="text-center text-3xl flex justify-center items-center text-main">
        Loading...
      </div>
    );
  if (isError || isPaymentError)
    return <div>Error: something went worng to getAll users or payments</div>;
  return (
    <>
      {((isLoading && isPaymentLoading) === false) && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-5 items-center justify-center ">
            <List title="Users" data={length} color="bg-amber-500" />
            <List
              title="total payments"
              data={paymentLength}
              color="bg-green-500"
            />
          </div>
          <div>
          <UsersTable data={data?.data?.users} />
          </div>
        </div>
      )}
    </>
  );
};

export default GetAllUsers;
