import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import CardImage from "./CardImage"
import { CoursePakage } from "@/types/types";
import PaymentForm from "./PaymentForm";
import { useUserActions } from "@/lib/store/hooks/useUserActions";
import { toast } from "sonner";

const ProductsCard = ({product}: {product: CoursePakage}) => {
  const {coursePurchase} = useUserActions()
  const handleFormSubmit = async(data: { affiliateCode: string }) => {
    // Handle payment submission here
    try {
      const givenData = {
        affiliateCode: data.affiliateCode,
        courseId: product._id || "",
      }
    const res = await coursePurchase(givenData)
    if(res){
      toast.success("Course purchased successfully")
    }

    } catch (error) {
      console.error("Error submitting payment:", error)
      toast.error("Error submitting payment")
    }

  }
  return (
    <Card className="bg-black text-white">
    <CardHeader>
     <div className="w-full mx-auto">
     <CardImage url={product && product.image}/>
     </div>
      <CardTitle>{product && product.name}</CardTitle>
      <CardDescription>{product?.description || "Description"}</CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div className="grid w-full items-center gap-4">
          <div className="flex items-center justify-between">
            <h3>caregory: {product && product.category}</h3>
            <h3>isAvail: {product && product.status}</h3>
          </div>
          <div className="flex flex-col space-y-1.5">
           <h3>price: {product && product.price}</h3>
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter className="w-full flex">
    <PaymentForm product={product} onFormSubmit={handleFormSubmit} />
      </CardFooter>
  </Card>
  );
};

export default ProductsCard;
