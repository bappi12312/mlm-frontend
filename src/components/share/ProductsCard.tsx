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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CardImage from "./CardImage"
import { CoursePakage } from "@/types/types";

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
      <Button className="flex-1" variant={"destructive"}>pay now</Button>
    </CardFooter>
  </Card>
  );
};

export default ProductsCard;
