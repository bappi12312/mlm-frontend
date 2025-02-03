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
import { User } from "@/lib/store/features/authSlice";

type Props = {
  data: User[];
  heading: string[]
}

export function UsersTable({data,heading}: Props) {
  return (
    <Table>
      <TableCaption>A list of your recent users.</TableCaption>
      <TableHeader>
        <TableRow>
         {
          heading && heading?.map((head) => (
            <TableHead key={head} className="w-[100px]">Name</TableHead>
          ))
         }
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((invoice) => (
          <TableRow key={invoice._id}>
            <TableCell className="font-medium">{invoice.name}</TableCell>
            <TableCell>{invoice.status}</TableCell>
            <TableCell>{invoice.role || "user"}</TableCell>
            <TableCell className="text-right">{invoice.earnings || 0}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{data?.reduce((total, invoice) => total + Number(invoice.earnings) || 0, 0)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
