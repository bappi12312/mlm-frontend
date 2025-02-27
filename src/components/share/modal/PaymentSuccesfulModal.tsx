
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Inputs } from "@/components/profile/ProfileDetals";

const PaymentSuccesfulModal = ({ 
  paymentDetails,
  open,
  onOpenChange 
}: { 
  paymentDetails: Inputs | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center mb-4 text-green-500">
            Payment Successful! 🎉
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
              <span className="text-4xl text-green-500">✔</span>
            </div>
            <p className="text-gray-300 mb-6">Your payment has been successfully processed. Here are the details:</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Transaction ID:</span>
              <span className="text-gray-200 font-mono">{paymentDetails?.transactionId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Amount:</span>
              <span className="text-gray-200">৳{paymentDetails?.Amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Your Number:</span>
              <span className="text-gray-200">{paymentDetails?.FromNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Receiver Number:</span>
              <span className="text-gray-200">{paymentDetails?.ToNumber}</span>
            </div>
          </div>

          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccesfulModal