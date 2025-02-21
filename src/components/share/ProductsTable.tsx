import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { useUserActions } from "@/lib/store/hooks/useUserActions";
import { CoursePakage } from "@/types/types";

type Props = {
  data: CoursePakage[];
  heading: string[];
}

const ProductsTable = ({data,heading}: Props) => {
  const { deleteProduct} = useUserActions();

  const handleDelete = async(id: string) => {
    try {
      await deleteProduct(id)
      toast.success("Course deleted successfully!");
    } catch (error) {
      console.error("Error in handleDelete:", error); // Log the error
      toast.error("Failed to delete course");
    }
  }
  return (
    <>
    <div className="flex justify-center h-full">
      <h1 className="text-2xl md:text-3xl font-bold text-main">Active Courses</h1>
    </div>
    <Table>
      <TableCaption>A list of your recent course.</TableCaption>
      <TableHeader>
        <TableRow>
         {
          heading && heading?.map((head) => (
            <TableHead key={head} className="w-[100px]">{head}</TableHead>
          ))
         }
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((invoice) => (
          <TableRow key={invoice._id}>
            <TableCell className="font-medium">{invoice.name}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice?.name}</TableCell>
            <TableCell className="text-right">{invoice?.price || 0}</TableCell>
            <TableCell className="text-right">
            <Button size={"sm"} onClick={()=> handleDelete(invoice?._id || "")}>Delete</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {/* <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{data?.reduce((total, invoice) => total + Number(invoice.earnings) || 0, 0)}</TableCell>
        </TableRow> */}
      </TableFooter>
    </Table>
    </>
  )
}

export default ProductsTable