"use client";

import { fetcher } from "@/components/admin/GetAllUsers";
import { Inputs } from "@/components/profile/ProfileDetals";
import ProductsCard from "@/components/share/ProductsCard"
import {
  url,
  usePaymentCreationMutation,
} from "@/lib/store/features/api/authApi";
import { CoursePakage } from "@/types/types";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PaymentSuccesfulModal from "@/components/share/modal/PaymentSuccesfulModal";


const ProductPage = () => {
  const { data, error, isLoading : loading } = useSWR(`${url}/get-all-courses?page=1&limit=10&status=active&sort=-createdAt`, fetcher);

  const [isFirstModalOpen, setIsFirstModalOpen] = useState(false);
  const [isSecondModalOpen, setIsSecondModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<Inputs | null>(null);

  const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm<Inputs>();

    const [paymentCreation, { isLoading }] = usePaymentCreationMutation();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
      try {
        const result = await paymentCreation(data).unwrap();
        toast.success(result?.message || "Submission successful!");
        setIsSecondModalOpen(false);
        setPaymentDetails(data);
        setIsSecondModalOpen(false);
        setIsSuccessModalOpen(true); // Add this line
        reset();
      } catch (error: unknown) {
        console.error("Submission failed", error);
        toast.error( "Submission failed. Please try again.");
      }
    };
  
  
  const courses : CoursePakage[] = data?.data?.courses

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: something went wrong</div>
  return (
    <div className="container w-full space-y-20">
      <div>
         {/* Activate Account Button */}
         {  (
              <div className="mt-6">
                <Dialog open={isFirstModalOpen} onOpenChange={setIsFirstModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-lg">
                      Want to be a Affiliator 
                    </Button>
                  </DialogTrigger>
                  
                  {/* First Modal - Payment Instructions */}
                  <DialogContent className="bg-gray-800 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-center mb-4">
                        Activation Instructions
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-gray-300 mb-4">
                          Please send ৳250 to one of these numbers:
                        </p>
                        <div className="space-y-3 font-mono">
                          <p>Bkash: 01795944731</p>
                          <p>Nagad: 01795944731</p>
                          <p>Rocket: 01795944731</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <Button 
                          onClick={() => {
                            setIsFirstModalOpen(false);
                            setIsSecondModalOpen(true);
                          }}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                        I&apos;ve Sent Payment - Next
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsFirstModalOpen(false)}
                          className="w-full text-gray-300 hover:bg-gray-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
      </div>
      <div>
         {/* Payment Form Modal */}
      <Dialog open={isSecondModalOpen} onOpenChange={setIsSecondModalOpen}>
        <DialogContent className="bg-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center mb-4">
              Payment Details
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="number"
                  placeholder="Your Mobile Number"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("FromNumber", { 
                    required: "Your number is required",
                    minLength: {
                      value: 11,
                      message: "Must be a valid BD number"
                    }
                  })}
                />
                {errors.FromNumber && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.FromNumber.message}
                  </span>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Transaction ID"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("transactionId", { 
                    required: "Transaction ID is required",
                  })}
                />
                {errors?.transactionId && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors?.transactionId?.message}
                  </span>
                )}
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Receiver's Number (01795944731)"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("ToNumber", { 
                    required: "Receiver number is required",
                    // validate: value => 
                    //   value === 1795944731 || "Must be our payment number"
                  })}
                />
                {errors.ToNumber && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.ToNumber.message}
                  </span>
                )}
              </div>

              <div>
                <input
                  type="number"
                  placeholder="Amount (৳250)"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("Amount", { 
                    required: "Amount is required",
                    min: {
                      value: 250,
                      message: "Minimum amount is ৳250"
                    }
                  })}
                />
                {errors.Amount && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.Amount.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  "Submit Payment Details"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSecondModalOpen(false)}
                className="w-full text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      </div>
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

        {/* Payment Success Modal */}
        <PaymentSuccesfulModal
        paymentDetails={paymentDetails}
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      />
    </div>
  )
}

export default ProductPage