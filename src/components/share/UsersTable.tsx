

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
import { Button } from "@/components/ui/button"
import { toast } from "sonner";
import { useUserActions } from "@/lib/store/hooks/useUserActions";

type Props = {
  data: User[];
  heading: string[];
}

export function UsersTable({data,heading}: Props) {
  const { deleteUser } = useUserActions();


  const handleDelete = async(id: string) => {
    try {
      console.log(id)
      await deleteUser(id)
    } catch (error) {
      console.error("Error in handleDelete:", error); // Log the error
      toast.error("Failed to delete user");
    }
  }
  return (
    <Table>
      <TableCaption>A list of your recent users.</TableCaption>
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
            <TableCell>{invoice.role || "user"}</TableCell>
            <TableCell className="text-right">{invoice.earnings || 0}</TableCell>
            <TableCell className="text-right">
            <Button size={"sm"} onClick={()=> handleDelete(invoice._id)}>Delete</Button>
            </TableCell>
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
