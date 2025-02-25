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
import { useState } from "react";
import { toast } from "sonner";
import { useUserActions } from "@/lib/store/hooks/useUserActions";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

type Props = {
  data: Payment[];
  heading: string[];
}

type FieldType = "isPayForCourse" | "isPay" | "isAffiliate" | "status";

const PaymentTable = ({data,heading}: Props) => {
  const [selectedField, setSelectedField] = useState<FieldType | "">("");
    const [fieldValue, setFieldValue] = useState<
      boolean | "Active" | "Inactive" | null
    >(null);


    const {  updateUserStatus,activateAffiliate  } =
    useUserActions();

  const handleActivate = async (id: string) => {
    try {
      console.log("id", id);
      const result = await activateAffiliate(id);
      console.log("result", result);
      if (result === false) {
        toast.error("Failed to activate user");
        return;
      }
      toast.success("User activated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to activate user");
    }
  };

  const handleSubmit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();

    if (!selectedField || fieldValue === null) {
      toast.error("Please select a field and value to update");
      return;
    }

    try {
      const payload = {
        [selectedField]: fieldValue,
      };

      const result = await updateUserStatus(id, payload);
      console.log("result", result);
      if (result === false) {
        toast.error("Failed to update user status");
        return;
      }
      setSelectedField("");
      setFieldValue(null);
      toast.success("User status updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update user status");
    }
  };

  const renderValueInput = () => {
    if (!selectedField) return null;

    if (selectedField === "status") {
      return (
        <Select
          value={fieldValue?.toString() || ""}
          onValueChange={(value: "Active" | "Inactive") => setFieldValue(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Switch
          checked={fieldValue as boolean}
          onCheckedChange={(val) => setFieldValue(val)}
          id={`${selectedField}-toggle`}
        />
        <label htmlFor={`${selectedField}-toggle`}>
          {fieldValue ? "True" : "False"}
        </label>
      </div>
    );
  };

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
            <TableCell >{invoice?.status || "Pending"}</TableCell>
            <TableCell >{ new Date(invoice?.PaymentDate).toLocaleDateString()}</TableCell>
            <TableCell className="text-right">
                <form
                  onSubmit={(e) => handleSubmit(e, invoice.user)}
                  className="w-full flex items-center justify-center gap-3"
                >
                  <Select
                    value={selectedField}
                    onValueChange={(value: FieldType) => {
                      setSelectedField(value);
                      setFieldValue(value === "status" ? null : false);
                    }}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="isPayForCourse">
                        Course Payment
                      </SelectItem>
                      <SelectItem value="isPay">Payment Status</SelectItem>
                      <SelectItem value="isAffiliate">
                        Affiliate Status
                      </SelectItem>
                      <SelectItem value="status">Account Status</SelectItem>
                    </SelectContent>
                  </Select>

                  {renderValueInput()}

                  <Button
                    type="submit"
                    variant="default"
                    disabled={!selectedField || fieldValue === null}
                  >
                    Update
                  </Button>
                </form>
              </TableCell>
              <TableCell>
                <Button size={"sm"} onClick={()=> handleActivate(invoice?.user)}>Activate</Button>
              </TableCell>
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