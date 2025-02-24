import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { CoursePakage } from "@/types/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { usePaymentCreationMutation } from "@/lib/store/features/api/authApi"
import { toast } from "sonner"

// Payment details schema
const paymentSchema = z.object({
  fromNumber: z.string().min(11, "Must be a valid BD number"),
  toNumber: z.string().min(11, "Must be a valid BD number"),
  amount: z.number().min(100, "Minimum amount is ৳100")
})

// Affiliate code schema
const affiliateSchema = z.object({
  affiliateCode: z.string().min(1, "Affiliate code is required"),
})

type PaymentFormProps = {
  product: CoursePakage
  onFormSubmit: (data: { affiliateCode: string }) => void
}

const PaymentForm = ({ product, onFormSubmit }: PaymentFormProps) => {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [paymentCreation, { isLoading }] = usePaymentCreationMutation()

  // Payment details form
  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fromNumber: "",
      toNumber: "",
      amount: product.price
    }
  })

  // Affiliate code form
  const affiliateForm = useForm<z.infer<typeof affiliateSchema>>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: {
      affiliateCode: "",
    },
  })

  const handlePaymentSubmit = async (values: z.infer<typeof paymentSchema>) => {
    try {
      const result = await paymentCreation({
        FromNumber: Number(values.fromNumber),
        ToNumber: Number(values.toNumber),
        Amount: values.amount
      }).unwrap()
      
      toast.success(result?.message || "Payment verified successfully!")
      setCurrentStep(2)
    } catch (error: any) {
      toast.error(error?.data?.message || "Payment verification failed")
    }
  }

  const handleAffiliateSubmit = async (values: z.infer<typeof affiliateSchema>) => {
    try {
      // Wait for parent submission to complete
      await onFormSubmit(values);
      
      toast.success("Payment completed successfully!");
      setCurrentStep(0);
      affiliateForm.reset();
      paymentForm.reset();
    } catch (error) {
      // Handle errors from parent submission
      toast.error("Failed to complete payment. Please try again.");
    }
  };
  const steps = [
    {
      title: "Payment Instructions",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            Please complete your payment of ৳{product.price} to one of these numbers:
          </p>
          <div className="space-y-2 font-mono">
            <p>Bkash: 01795944731</p>
            <p>Nagad: 01795944731</p>
            <p>Rocket: 01795944731</p>
          </div>
          <Button 
            className="w-full mt-4"
            onClick={() => setCurrentStep(1)}
          >
            I've Made Payment - Next
          </Button>
        </div>
      )
    },
    {
      title: "Payment Verification",
      content: (
        <Form {...paymentForm}>
          <form onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)} className="space-y-6">
            <FormField
              control={paymentForm.control}
              name="fromNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Mobile Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="017XXXXXXXX"
                      className="text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={paymentForm.control}
              name="toNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receiver's Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="01795944731"
                      className="text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={paymentForm.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`৳${product.price}`}
                      className="text-gray-400"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCurrentStep(0)}
                type="button"
              >
                Back
              </Button>
              <Button 
                className="w-full"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Payment"}
              </Button>
            </div>
          </form>
        </Form>
      )
    },
    {
      title: "Affiliate Code",
      content: (
        <Form {...affiliateForm}>
          <form onSubmit={affiliateForm.handleSubmit(handleAffiliateSubmit)} className="space-y-6">
            <FormField
              control={affiliateForm.control}
              name="affiliateCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affiliate Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter affiliate code"
                      className="text-gray-400"
                      {...field}
                      // Add this to ensure input updates
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* ... rest of the form ... */}
          </form>
        </Form>
      )
    }
  ]

  return (
    <Dialog  onOpenChange={() => {
      if (!open) {
        setCurrentStep(0);
        paymentForm.reset();
        affiliateForm.reset();
      }
    }}>
      <DialogTrigger asChild>
        <Button className="flex-1" variant={"destructive"}>
          Pay now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black text-white">
        <DialogHeader>
          <DialogTitle>{steps[currentStep].title}</DialogTitle>
          {currentStep === 0 && (
            <p className="text-sm text-gray-400">
              Purchasing: {product.name}
            </p>
          )}
        </DialogHeader>
        
        {steps[currentStep].content}
      </DialogContent>
    </Dialog>
  )
}

export default PaymentForm