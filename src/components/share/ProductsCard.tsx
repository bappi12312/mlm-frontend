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
  const handleFormSubmit = async (data: { affiliateCode: string }) => {
    try {
      const givenData = {
        affiliateCode: data.affiliateCode,
        courseId: product._id || "",
      };
      
      const res = await coursePurchase(givenData);
      
      if (res === true) {
        toast.success("Course purchased successfully");
        return true; // Return success status
      } else {
        toast.error("Failed to purchase course");
        return false; // Return failure status
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      toast.error("Error submitting payment");
      throw error; // Throw error to be caught in child component
    }
  };
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
