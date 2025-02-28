import { PaymentRequest } from "@/types/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  data: PaymentRequest[];
  heading: string[];
}

const PaymentRequestTable = ({ data, heading }: Props) => {
  return (
    <>
      <div className="flex justify-center h-full">
        <h1 className="text-2xl md:text-3xl font-bold text-main">সক্রিয় কোর্সগুলি</h1>
      </div>
      <Table>
        <TableCaption>আপনার সাম্প্রতিক কোর্সের তালিকা।</TableCaption>
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
              <TableCell className="font-medium">{invoice.type}</TableCell>
              <TableCell>{invoice.confirmNumber}</TableCell>
              <TableCell>{invoice?.type}</TableCell>
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

export default PaymentRequestTable;