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
      toast.success(result?.message || "Submission successful!");
      setPaymentDetails(data);
      setIsSecondModalOpen(false);
      setIsSuccessModalOpen(true);
      reset();
    } catch (error: unknown) {
      console.error("Submission failed", error);
      toast.error( "Submission failed. Please try again.");
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-8">
      {/* Profile Card */}
      <div className="w-full md:w-1/2 bg-gray-800 rounded-lg">
        <div className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800">
          <Image
            className="object-cover object-center w-full h-56 rounded-full"
            width={300}
            height={300}
            src={user?.photo || "/default-avatar.jpg"}
            alt="avatar"
          />

          <div className="flex items-center px-6 py-3 bg-gray-900">
            <h1 className="mx-3 text-lg font-semibold text-white capitalize">
              Welcome to the TTO platform
            </h1>
          </div>

          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-white capitalize">
              {user?.name}
            </h1>

            <p className="py-2 text-gray-400">
              {user?.status === "Active" 
                ? "Your account is fully activated!"
                : "Activate your account to enable referral features"}
            </p>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">Status: {user?.status}</h1>
              <span className={user?.status === "Active" ? "text-green-500" : "text-red-500"}>
                {user?.status === "Active" ? "🟢" : "🔴"}
              </span>
            </div>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">Earnings: ৳{user?.earnings?.toFixed(2)}</h1>
            </div>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm break-all">{user?.email}</h1>
            </div>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">
                Referral code: {" "}
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
                    Package Link: {link.link}
                  </Link>
                ))}
              </div>
            )}

            {/* Activate Account Button */}
            {user?.status !== "Active" && (
              <div className="mt-6">
                <Dialog open={isFirstModalOpen} onOpenChange={setIsFirstModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-lg">
                      Activate Account
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
                          Please send ৳100 to one of these numbers:
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
        </div>
      </div>

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
                  type="text"
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
                  type="text"
                  placeholder="Receiver's Number (01795944731)"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("ToNumber", { 
                    required: "Receiver number is required",
                    // validate: value => 
                    //   value === (01795944731) || "Must be our payment number"
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
                  placeholder="Amount (৳100)"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("Amount", { 
                    required: "Amount is required",
                    min: {
                      value: 100,
                      message: "Minimum amount is ৳100"
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

        {/* Payment Success Modal */}
        <PaymentSuccesfulModal
        paymentDetails={paymentDetails}
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      />

      {/* Payment Components for Active Users */}
      {user?.status === "Active" && (
        <div className="w-full md:w-1/2 space-y-8">
          {Number(user?.earnings) > 0 && <PaymentRequested />}
        </div>
      )}
    </div>
  );
};

export default ProfileDetals;