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
      toast.error("Confirmation number doesn't match");
      return;
    }

    try {
      const result = await requestPayment(data).unwrap();
      toast.success(result?.message || "Payment request submitted successfully!");
      setIsModalOpen(false);
      reset();
    } catch (error: unknown) {
      console.error("Payment request failed", error);
      toast.error("Payment request failed");
    }
  };

  return (
    <div className="w-full">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            Request Payment Withdrawal
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center mb-4">
              Payment Withdrawal Request
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Payment Type (e.g., Bkash, Nagad)"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("type", { 
                    required: "Payment type is required",
                    validate: value => 
                      ["bkash", "nagad", "rocket"].includes(value.toLowerCase()) || 
                      "Supported types: Bkash, Nagad, Rocket"
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
                  placeholder="Your Mobile Number"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("number", { 
                    required: "Number is required",
                    minLength: {
                      value: 11,
                      message: "Must be a valid BD number"
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
                  placeholder="Confirm Mobile Number"
                  className="w-full p-3 bg-gray-700 rounded-lg placeholder-gray-400"
                  {...register("confirmNumber", { 
                    required: "Confirmation is required",
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
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  "Submit Request"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="w-full text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentRequested;