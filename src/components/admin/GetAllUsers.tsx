"use client";

import {
  useGetAllPaymentsQuery,
  useGetAllUsersQuery,
} from "@/lib/store/features/api/authApi";
import List from "../share/List";
import { UsersTable } from "../share/UsersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const GetAllUsers = () => {
  const { data, isLoading, isError } = useGetAllUsersQuery({});

  const {
    data: paymentData,
    isLoading: isPaymentLoading,
    isError: isPaymentError,
  } = useGetAllPaymentsQuery({});

  const length = data?.data?.users?.length;
  const paymentLength = paymentData?.data?.payments?.length;

  const heading = ["Name", "Status", "Role", "Earnings"];

  if (isLoading && isPaymentLoading)
    return (
      <div className="text-center text-3xl flex justify-center items-center text-main">
        Loading...
      </div>
    );
  if (isError || isPaymentError)
    return <div>Error: something went worng to getAll users or payments</div>;
  return (
    <div className=" flex justify-center items-center">
      {(isLoading && isPaymentLoading) === false && (
        <div className="space-y-6 flex items-center justify-center flex-col">
          <div className="flex flex-col md:flex-row gap-5 items-center justify-center">
            <List title="Users" data={length} color="bg-amber-500" />
            <List
              title="total payments"
              data={paymentLength}
              color="bg-green-500"
            />
          </div>
          <div className="container px-8">
            <div className="flex items-center justify-center mx-auto w-full">
              <Tabs defaultValue="account" className="text-white">
                <TabsList className="bg-green-600 text-white">
                  <TabsTrigger value="users">All Users</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                  <TabsTrigger value="request">Payment Request</TabsTrigger>
                </TabsList>
                <TabsContent value="users">
                  <UsersTable data={data?.data?.users} heading={heading} />
                </TabsContent>
                <TabsContent value="payments">
                  <UsersTable data={paymentData?.data?.payments} heading={heading} />
                </TabsContent>
                <TabsContent value="request">
                  payment request
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default GetAllUsers;
