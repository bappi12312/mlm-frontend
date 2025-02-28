import { useState } from 'react';
import { useRequestPaymentMutation } from "@/lib/store/features/api/authApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Inputs = {
  type: string;
  number: number;
  confirmNumber: number;
};

const PaymentRequested = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Inputs>();
  const [requestPayment, { isLoading }] = useRequestPaymentMutation();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.number !== data.confirmNumber) {
      toast.error("নিশ্চিতকরণ নাম্বার মিলে নি");
      return;
    }
    try {
      const result = await requestPayment(data).unwrap();
      toast.success(result?.message || "পেমেন্ট অনুরোধ সফলভ হয়েছে!");
      setIsModalOpen(false);
      reset();
    } catch (error: unknown) {
      console.error("পেমেন্ট অনুরোধ ব্যর্থ হয়েছে", error);
      toast.error("পেমেন্ট অনুরোধ ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="w-full">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            পেমেন্ট উইথড্রাউ অনুরোধ করুন
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center mb-4">
              পেমেন্ট উইথড্রাউ অনুরোধ
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="পেমেন্ট ধরণ (যেমন: Bkash, Nagad)"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("type", { 
                    required: "পেমেন্ট ধরণ প্রয়োজনীয়",
                    validate: value => 
                      ["bkash", "nagad", "rocket"].includes(value.toLowerCase()) || 
                      "সমর্থিত ধরণ: Bkash, Nagad, Rocket"
                  })}
                />
                {errors.type && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.type.message}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="number"
                  placeholder="আপনার মোবাইল নাম্বার"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("number", { 
                    required: "নাম্বার প্রয়োজনীয়",
                    minLength: {
                      value: 11,
                      message: "একটি ব্যবস্থাপনামূল্য BD নাম্বার হতে হবে"
                    }
                  })}
                />
                {errors.number && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.number.message}
                  </span>
                )}
              </div>
              <div>
                <input
                  type="number"
                  placeholder="নিশ্চিতকরণ মোবাইল নাম্বার"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("confirmNumber", { 
                    required: "নিশ্চিতকরণ প্রয়োজনীয়",
                  })}
                />
                {errors.confirmNumber && (
                  <span className="text-red-400 text-sm mt-1">
                    {errors.confirmNumber.message}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-pulse">প্রক্রিয়া করা হচ্ছে...</span>
                ) : (
                  "অনুরোধ জমা দিন"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="w-full text-gray-300 hover:bg-gray-700"
              >
                বাতিল করুন
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentRequested;