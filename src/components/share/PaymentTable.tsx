import { Payment } from "@/types/types";
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

type Props = {
  data: Payment[];
  heading: string[];
}

const PaymentTable = ({data,heading}: Props) => {
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
            <TableCell className="font-medium">{invoice.FromNumber}</TableCell>
            <TableCell>{invoice.ToNumber}</TableCell>
            <TableCell>{invoice?.Amount}</TableCell>
            <TableCell className="text-right">{invoice?.user || 0}</TableCell>
            {/* <TableCell className="text-right">
            <Button size={"sm"} onClick={()=> handleDelete(invoice?._id || "")}>Delete</Button>
            </TableCell> */}
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

export default PaymentTable