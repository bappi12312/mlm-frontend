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
        toast.success(result?.message || "সফলভাবে জমা দেওয়া হয়েছে!");
        setIsSecondModalOpen(false);
        setPaymentDetails(data);
        setIsSecondModalOpen(false);
        setIsSuccessModalOpen(true);
        reset();
      } catch (error: unknown) {
        console.error("জমা দিতে ব্যর্থ হয়েছে", error);
        toast.error("জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
      }
    };
  
  
  const courses : CoursePakage[] = data?.data?.courses

  if (loading) return <div>লোড হচ্ছে...</div>
  if (error) return <div>ত্রুটি: কিছু একটা সমস্যা হয়েছে</div>
  return (
    <div className="container w-full space-y-20">
      <div>
         {/* অ্যাক্টিভেশন বাটন */}
         {   (
              <div className="mt-6">
                <Dialog open={isFirstModalOpen} onOpenChange={setIsFirstModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-lg">
                      অ্যাফিলিয়েটর হতে চান 
                    </Button>
                  </DialogTrigger>
                  
                  {/* প্রথম মোডাল - পেমেন্ট নির্দেশনা */}
                  <DialogContent className="bg-gray-800 text-white max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-center mb-4">
                        অ্যাক্টিভেশন নির্দেশনা
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="text-center">
                        <p className="text-gray-300 mb-4">
                          অনুগ্রহ করে ৳২৫০ নিচের যেকোনো একটি নম্বরে পাঠান:
                        </p>
                        <div className="space-y-3 font-mono">
                          <p>বিকাশ: 01795944731</p>
                          <p>নগদ: 01795944731</p>
                          <p>রকেট: 01795944731</p>
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
                          আমি পেমেন্ট পাঠিয়েছি - পরবর্তী
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsFirstModalOpen(false)}
                          className="w-full text-gray-300 hover:bg-gray-700"
                        >
                          বাতিল করুন
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
      </div>
      <div>
         {/* পেমেন্ট ফর্ম মোডাল */}
      <Dialog open={isSecondModalOpen} onOpenChange={setIsSecondModalOpen}>
        <DialogContent className="bg-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center mb-4">
              পেমেন্ট বিবরণ
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="number"
                  placeholder="আপনার মোবাইল নম্বর"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("FromNumber", { 
                    required: "আপনার নম্বর প্রয়োজন",
                    minLength: {
                      value: 11,
                      message: "বৈধ বাংলাদেশী নম্বর হতে হবে"
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
                  placeholder="ট্রানজেকশন আইডি"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("transactionId", { 
                    required: "ট্রানজেকশন আইডি প্রয়োজন",
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
                  placeholder="রিসিভার নম্বর (০১৭৯৫৯৪৪৭৩১)"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("ToNumber", { 
                    required: "রিসিভার নম্বর প্রয়োজন",
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
                  placeholder="পরিমাণ (৳২৫০)"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("Amount", { 
                    required: "পরিমাণ প্রয়োজন",
                    min: {
                      value: 250,
                      message: "ন্যূনতম পরিমাণ ৳২৫০"
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
                  <span className="animate-pulse">প্রক্রিয়াকরণ হচ্ছে...</span>
                ) : (
                  "পেমেন্ট বিবরণ জমা দিন"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSecondModalOpen(false)}
                className="w-full text-gray-300 hover:bg-gray-700"
              >
                বাতিল করুন
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      </div>
      <div className="flex justify-center h-full">
        <h1 className="text-2xl md:text-3xl font-bold text-main">ফিচার্ড প্রোডাক্টসমূহ</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {
        courses && courses?.map((product) => (
          <ProductsCard key={product._id} product={product} />
        ))
      }
      </div>

        {/* পেমেন্ট সাক্সেস মোডাল */}
        <PaymentSuccesfulModal
        paymentDetails={paymentDetails}
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      />
    </div>
  )
}

export default ProductPage