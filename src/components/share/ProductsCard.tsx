import * as React from "react"
 
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const ProductsCard = ({product}: {product: CoursePakage}) => {
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
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex-1" variant={"destructive"}>
              Pay now
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black text-white sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Payment Information</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="affiliateCode" className="text-right">
                  Affiliate Code
                </label>
                <input
                  id="affiliateCode"
                  placeholder="Enter affiliate code"
                  className="col-span-3 p-2 text-black rounded"
                />
              </div>
              <Button type="submit" variant="destructive">
                Confirm Payment
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
  </Card>
  );
};

export default ProductsCard;
