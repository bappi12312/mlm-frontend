import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CoursePakage } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { usePaymentCreationMutation } from "@/lib/store/features/api/authApi";
import { toast } from "sonner";
import PaymentSuccesfulModal from "./modal/PaymentSuccesfulModal";

// পেমেন্ট বিবরণ সচéma
const paymentSchema = z.object({
  fromNumber: z.string().min(11, "বৈধ বাংলাদেশী নম্বর হতে হবে"),
  toNumber: z.string().min(11, "বৈধ বাংলাদেশী নম্বর হতে হবে"),
  amount: z.number().min(100, "ন্যূনতম পরিমাণ ৳১০০"),
  transactionId: z.string().min(1, "ট্রানজেকশন আইডি প্রয়োজন"),
});

// অ্যাফিলিয়েট কোড সচéma
const affiliateSchema = z.object({
  affiliateCode: z.string().min(1, "অ্যাফিলিয়েট কোড প্রয়োজন"),
});

type PaymentFormProps = {
  product: CoursePakage;
  onFormSubmit: (data: { affiliateCode: string }) => void;
};

const PaymentForm = ({ product, onFormSubmit }: PaymentFormProps) => {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = React.useState(false);
  const [paymentDetails, setPaymentDetails] = React.useState<{
    FromNumber: string;
    ToNumber: string;
    Amount: number;
    transactionId: string;
  }>({
    FromNumber: "",
    ToNumber: "",
    Amount: 0,
    transactionId: "",
  });
  const [paymentCreation, { isLoading }] = usePaymentCreationMutation();

  // পেমেন্ট বিবরণ ফর্ম
  const paymentForm = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      fromNumber: "",
      toNumber: "",
      transactionId: "",
      amount: product.price,
    },
  });

  // অ্যাফিলিয়েট কোড ফর্ম
  const affiliateForm = useForm<z.infer<typeof affiliateSchema>>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: {
      affiliateCode: "",
    },
  });

  const handlePaymentSubmit = async (values: z.infer<typeof paymentSchema>) => {
    try {
      const result = await paymentCreation({
        FromNumber: values.fromNumber,
        ToNumber: values.toNumber,
        Amount: Number(values.amount),
        transactionId: values.transactionId,
      }).unwrap();

      setPaymentDetails({
        FromNumber: values.fromNumber,
        ToNumber: values.toNumber,
        Amount: values.amount,
        transactionId: values.transactionId,
      });

      toast.success(result?.message || "পেমেন্ট সফলভাবে যাচাই করা হয়েছে!");
      setCurrentStep(2);
    } catch (error: unknown) {
      toast.error("পেমেন্ট যাচাই ব্যর্থ হয়েছে");
    }
  };

  const handleAffiliateSubmit = async (
    values: z.infer<typeof affiliateSchema>
  ) => {
    try {
      await onFormSubmit(values);
      toast.success("পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!");
      setIsSuccessModalOpen(true);
      setCurrentStep(0);
      affiliateForm.reset();
      paymentForm.reset();
    } catch (error) {
      toast.error("পেমেন্ট সম্পন্ন করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।");
    }
  };

  const steps = [
    {
      title: "পেমেন্ট নির্দেশনা",
      content: (
        <div className="space-y-4">
          <p className="text-gray-300">
            অনুগ্রহ করে ৳{product.price} পরিমাণ নিচের যেকোনো একটি নম্বরে পেমেন্ট সম্পন্ন করুন:
          </p>
          <div className="space-y-2 font-mono">
            <p>বিকাশ: 01795944731</p>
            <p>নগদ: 01795944731</p>
            <p>রকেট: 01795944731</p>
          </div>
          <Button className="w-full mt-4" onClick={() => setCurrentStep(1)}>
            আমি পেমেন্ট করেছি - পরবর্তী
          </Button>
        </div>
      ),
    },
    {
      title: "পেমেন্ট যাচাইকরণ",
      content: (
        <Form {...paymentForm}>
          <form
            onSubmit={paymentForm.handleSubmit(handlePaymentSubmit)}
            className="space-y-6"
          >
            <FormField
              control={paymentForm.control}
              name="fromNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>আপনার মোবাইল নম্বর</FormLabel>
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
                  <FormLabel>রিসিভার মোবাইল নম্বর</FormLabel>
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
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ট্রানজেকশন আইডি</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ট্রানজেকশন আইডি লিখুন"
                      className="text-gray-400"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
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
                  <FormLabel>পরিমাণ</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`৳${product.price}`}
                      className="text-gray-400"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                পিছনে
              </Button>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "যাচাই করা হচ্ছে..." : "পেমেন্ট যাচাই করুন"}
              </Button>
            </div>
          </form>
        </Form>
      ),
    },
    {
      title: "অ্যাফিলিয়েট কোড",
      content: (
        <Form {...affiliateForm}>
          <form
            onSubmit={affiliateForm.handleSubmit(handleAffiliateSubmit)}
            className="space-y-6"
          >
            <FormField
              control={affiliateForm.control}
              name="affiliateCode"
              render={({  }) => (
                <FormField
                  control={affiliateForm.control}
                  name="affiliateCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>অ্যাফিলিয়েট কোড</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="অ্যাফিলিয়েট কোড লিখুন"
                          className="text-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setCurrentStep(0)}
                type="button"
              >
                পিছনে
              </Button>
              <Button className="w-full" type="submit" disabled={isLoading}>
                {isLoading ? "যাচাই করা হচ্ছে..." : "পেমেন্ট সম্পন্ন করুন"}
              </Button>
            </div>
          </form>
        </Form>
      ),
    },
  ];

  return (
    <>
      <Dialog
        onOpenChange={() => {
          if (!open) {
            setCurrentStep(0);
            paymentForm.reset();
            affiliateForm.reset();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button className="flex-1" variant={"destructive"}>
            এখনই পেমেন্ট করুন
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-black text-white">
          <DialogHeader>
            <DialogTitle>{steps[currentStep].title}</DialogTitle>
            {currentStep === 0 && (
              <p className="text-sm text-gray-400">ক্রয় করা হচ্ছে: {product.name}</p>
            )}
          </DialogHeader>

          {steps[currentStep].content}
        </DialogContent>
      </Dialog>

      <PaymentSuccesfulModal
        open={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        paymentDetails={paymentDetails}
      />
    </>
  );
};

export default PaymentForm;