"use client";

import { useState } from "react";
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
import { User } from "@/lib/store/features/authSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Update, useUserActions } from "@/lib/store/hooks/useUserActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  data: User[];
  heading: string[];
};

type FieldType = "isPayForCourse" | "isPay" | "isAffiliate" | "status";

export function UsersTable({ data, heading }: Props) {
  // Initialize with empty string instead of null
  const [selectedField, setSelectedField] = useState<FieldType | "">("");
  const [fieldValue, setFieldValue] = useState<
    boolean | "Active" | "Inactive" | ""
  >("");
  const { deleteUser,updateUserStatus } = useUserActions();

  const handleSubmit = async (e: React.FormEvent, id: string) => {
    e.preventDefault();

    if (!selectedField || !fieldValue) {
      alert("Please select a field and provide a value");
      return;
    }

    // Type-safe payload construction
    const payload = {
      [selectedField]: fieldValue
    };
    try {
   const result = await updateUserStatus(id, payload);
   console.log(result);
      // Reset the form
      setSelectedField("");
      setFieldValue("");

      // Show success message
      toast.success("User status updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      console.log(id);
      await deleteUser(id);
      await deleteUser(id);
    } catch (error) {
      console.error("Error in handleDelete:", error); // Log the error
      toast.error("Failed to delete user");
    }
  };

  return (
    <div>
      <div className="flex justify-center h-full">
        <h1 className="text-2xl md:text-3xl font-bold text-main">
          Active Courses
        </h1>
      </div>
      <Table>
        <TableCaption>A list of your recent users.</TableCaption>
        <TableHeader>
          <TableRow>
            {heading &&
              heading?.map((head) => (
                <TableHead key={head} className="w-[100px]">
                  {head}
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((invoice) => (
            <TableRow key={invoice._id}>
              <TableCell className="font-medium">{invoice.name}</TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{invoice?.name}</TableCell>
              <TableCell className="text-right">
                {invoice?.earnings || 0}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size={"sm"}
                  onClick={() => handleDelete(invoice?._id || "")}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <form onSubmit={(e) => handleSubmit(e, invoice._id)}>
                  <Select
                    value={selectedField}
                    onValueChange={(value: FieldType) => {
                      setSelectedField(value);
                      setFieldValue(value === "status" ? "" : false);
                    }}
                  >
                    <SelectTrigger className="w-[90px]">
                      {/* Provide fallback value */}
                      <SelectValue placeholder="change">
                        {selectedField || ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="isPayForCourse">
                        isPayForCourse
                      </SelectItem>
                      <SelectItem value="isPay">isPay</SelectItem>
                      <SelectItem value="isAffiliate">isAffiliate</SelectItem>
                      <SelectItem value="status">status</SelectItem>
                    </SelectContent>
                  </Select>

                  {selectedField === "status" ? (
                    <Select
                      value={fieldValue.toString()}
                      onValueChange={(value: "Active" | "Inactive") =>
                        setFieldValue(value)
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : null}
                  <button
                    type="submit"
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    disabled={!selectedField || !fieldValue}
                  >
                    Submit
                  </button>
                </form>
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
    </div>
  );
}
