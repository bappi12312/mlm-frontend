import { url } from "@/lib/store/features/api/authApi";
import List from "../share/List";
import { UsersTable } from "../share/UsersTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthFromCookies } from "@/lib/utils/cookieUtils";
import useSWR from "swr";
import { User } from "@/lib/store/features/authSlice";
import { Payment,PaymentRequest } from "@/types/types";
import PaymentTable from "../share/PaymentTable";
import PaymentRequestTable from "../share/PaymentRequestTable";

export const fetcher = async (url: string) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getAuthFromCookies()?.accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

const GetAllUsers = () => {
  const { data, error, isLoading } = useSWR(`${url}/get-all-users`, fetcher);
  const {
    data: paymentData,
    error: paymentError,
    isLoading: paymentLoading,
  } = useSWR(`${url}/getAllPayment`, fetcher);

  const {
    data: requestPaymentData,
    error: requestPaymentError,
    isLoading: requestPaymentLoading,
  } = useSWR(`${url}/get-allPayment-request`, fetcher);

  const users: User[] = data?.data?.users;
  const usersPayment: Payment[] = paymentData?.data?.payments;
  const paymentRequest: PaymentRequest[] = requestPaymentData?.data?.paymentRequestes || [];

  const paymentLength = usersPayment?.length;

  const heading: string[] = [
    "Name",
    "Status",
    "Role",
    "Earnings",
    "Delete",
    "Action",
    "link",
  ];


  if (isLoading)
    return (
      <div className="text-center text-3xl flex justify-center items-center text-main">
        Loading...
      </div>
    );
  if (error)
    return <div>Error: something went worng to getAll users or payments</div>;
  return (
    <div className="space-y-6">
      <div className="flex justify-center items-center">
        {isLoading === false && (
          <div className="space-y-6 flex items-center justify-center flex-col">
            <div className="flex flex-col md:flex-row gap-5 items-center justify-center">
              <List
                title="Users"
                data={users?.length || 0}
                color="bg-amber-500"
              />
              <List
                title="total payments"
                data={paymentLength || 0}
                color="bg-green-500"
              />
            </div>
          </div>
        )}
      </div>
      <div className="overflow-x-auto container mx-auto">
      <Tabs defaultValue="users" >
        <TabsList className="bg-main flex justify-center items-center ">
          <TabsTrigger value="users" name="users">Users</TabsTrigger>
          <TabsTrigger value="payments" name="payments">Payments</TabsTrigger>
          <TabsTrigger value="paymentsRequest" name="paymentsRequest">Request</TabsTrigger>
        </TabsList>
        <TabsContent className="mt-8" value="users">
          <UsersTable data={users || []} heading={heading} />
        </TabsContent>
        {
      paymentLoading ? (
        <div className="text-center text-3xl flex justify-center items-center text-main">
          Loading...
        </div>
      ) : paymentError  ? ( <div>Error: something went worng to get payments</div> ) : (
        <TabsContent value="payments">
          <PaymentTable data={usersPayment || []} heading={["FromNumber", "ToNumber", "Amount","Status","PaymentDate","Action","ActivateAffiliate","Commission","Delete"]} />
        </TabsContent>
      )
        }
        <TabsContent value="paymentsRequest">
         {
          requestPaymentLoading ? (
            <div className="text-center text-3xl flex justify-center items-center text-main">
              Loading...
            </div>
          ) : requestPaymentError  ? ( <div>Error: something went worng to get payments</div> ) : (
            <PaymentRequestTable data={paymentRequest || []} heading={["Name", "Amount"]} />
          )
         }
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default GetAllUsers;
