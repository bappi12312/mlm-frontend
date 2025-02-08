import {
  url,
} from "@/lib/store/features/api/authApi";
import List from "../share/List";
import { UsersTable } from "../share/UsersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthFromCookies } from "@/lib/utils/cookieUtils";
import useSWR from "swr";
import { User } from "@/lib/store/features/authSlice";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getAuthFromCookies()?.accessToken}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

interface Payment {
  _id: string;
  Amount: number;
  FromNumber: string;
  PaymentDate: string;
  updatedAt: string;
  createdAt: string;
  ToNumber: string;
  user: string;
  __v: number;
}


const GetAllUsers = () => {
  const { data, error, isLoading } = useSWR(`${url}/get-all-users`, fetcher);
  const { data: paymentData, error: paymentError, isLoading: paymentLoading } = useSWR(`${url}/getAllPayment`, fetcher);

 const users: User[] = data?.data?.users
 const usersPayment: Payment[] = paymentData?.data?.payments
  

  const heading: string[] = ["Name", "Status", "Role", "Earnings"];

  if (isLoading || paymentLoading)
    return (
      <div className="text-center text-3xl flex justify-center items-center text-main">
        Loading...
      </div>
    );
  if (error || paymentError)
    return <div>Error: something went worng to getAll users or payments</div>;
  return (
    <div className=" flex justify-center items-center">
      {isLoading === false && (
        <div className="space-y-6 flex items-center justify-center flex-col">
          <div className="flex flex-col md:flex-row gap-5 items-center justify-center">
            <List title="Users" data={users?.length || 0} color="bg-amber-500" />
            <List
              title="total payments"
              data={10}
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
                  <UsersTable data={users || []} heading={heading} fetcher={fetcher} />
                </TabsContent>
                {/* <TabsContent value="payments">
                  <UsersTable data={paymentData?.data?.payments} heading={heading} />
                </TabsContent> */}
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
