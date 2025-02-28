import { useState } from 'react';
import { usePaymentCreationMutation } from "@/lib/store/features/api/authApi";
import { useAppSelector } from "@/lib/store/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import PaymentRequested from "./PaymentRequested";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import PaymentSuccesfulModal from '../share/modal/PaymentSuccesfulModal';

export type Inputs = {
  FromNumber: string;
  ToNumber?: string;
  Amount: number;
  transactionId: string;
};

const ProfileDetals = () => {
  const { user } = useAppSelector((state) => state.auth);
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
      console.log(data)
      const result = await paymentCreation(data).unwrap();
      toast.success(result?.message || "সফলভাবে জমা দেওয়া হয়েছে!");
      setPaymentDetails(data);
      setIsSecondModalOpen(false);
      setIsSuccessModalOpen(true);
      reset();
    } catch (error: unknown) {
      console.error("জমা দিতে ব্যর্থ হয়েছে", error);
      toast.error("জমা দিতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-8">
      {/* প্রোফাইল কার্ড */}
      <div className="w-full md:w-1/2 bg-gray-800 rounded-lg">
        <div className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800">
          <Image
            className="object-cover object-center w-full h-56 rounded-full"
            width={300}
            height={300}
            src={user?.photo || "/default-avatar.jpg"}
            alt="প্রোফাইল ছবি"
          />

          <div className="flex items-center px-6 py-3 bg-gray-900">
            <h1 className="mx-3 text-lg font-semibold text-white capitalize">
              TTO প্ল্যাটফর্মে স্বাগতম
            </h1>
          </div>

          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-white capitalize">
              {user?.name}
            </h1>

            <p className="py-2 text-gray-400">
              {user?.status === "Active" 
                ? "আপনার অ্যাকাউন্ট সম্পূর্ণ সক্রিয় হয়েছে!"
                : "রেফারেল সুবিধা সক্রিয় করতে আপনার অ্যাকাউন্ট অ্যাক্টিভেট করুন"}
            </p>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">স্ট্যাটাস: {user?.status}</h1>
              <span className={user?.status === "Active" ? "text-green-500" : "text-red-500"}>
                {user?.status === "Active" ? "🟢" : "🔴"}
              </span>
            </div>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">আয়: ৳{user?.earnings?.toFixed(2)}</h1>
            </div>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm break-all">{user?.email}</h1>
            </div>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">
                রেফারেল কোড: {" "}
                <span className="text-emerald-400 font-mono">
                  {user?.referalCode}
                </span>
              </h1>
            </div>

            {user && user?.pakageLink?.length > 0 && (
              <div className="mt-4 space-y-2">
                {user.pakageLink.map((link) => (
                  <Link
                    key={link._id}
                    href={link.link}
                    className="px-2 text-emerald-400 hover:text-emerald-300 break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    প্যাকেজ লিঙ্ক: {link.link}
                  </Link>
                ))}
              </div>
            )}

            {/* অ্যাকাউন্ট সক্রিয় বাটন */}
            {user?.status !== "Active" && (
              <div className="mt-6">
                <Dialog open={isFirstModalOpen} onOpenChange={setIsFirstModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-lg">
                      অ্যাকাউন্ট সক্রিয় করুন
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
                          অনুগ্রহ করে ৳১০০ নিচের যেকোনো একটি নম্বরে পাঠান:
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
        </div>
      </div>

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
                  type="text"
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
                  type="text"
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
                  placeholder="পরিমাণ (৳১০০)"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("Amount", { 
                    required: "পরিমাণ প্রয়োজন",
                    min: {
                      value: 100,
                      message: "ন্যূনতম পরিমাণ ৳১০০"
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

        {/* পেমেন্ট সফল মোডাল */}
        <PaymentSuccesfulModal
        paymentDetails={paymentDetails}
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      />

      {/* সক্রিয় ব্যবহারকারীদের জন্য পেমেন্ট কম্পোনেন্ট */}
      {user?.status === "Active" && (
        <div className="w-full md:w-1/2 space-y-8">
          {Number(user?.earnings) > 0 && <PaymentRequested />}
        </div>
      )}
    </div>
  );
};

export default ProfileDetals;