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

// Form validation schema
const formSchema = z.object({
  affiliateCode: z.string().min(1, "Affiliate code is required"),
})

type PaymentFormProps = {
  product: CoursePakage
  onFormSubmit: (data: { affiliateCode: string }) => void
}

const PaymentForm = ({ product, onFormSubmit }: PaymentFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      affiliateCode: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    onFormSubmit(values)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex-1" variant={"destructive"}>
          Pay now
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black text-white">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <p className="text-sm text-gray-400">
            Purchasing: {product.name} (${product.price})
          </p>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="affiliateCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Affiliate Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter affiliate code"
                      className="text-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="destructive" className="w-full">
              Confirm Payment
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentForm