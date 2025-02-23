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
import { useUserActions } from "@/lib/store/hooks/useUserActions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

type Props = {
  data: User[];
  heading: string[];
};
type PackageLinkFormValues = {
  link: string;
};

type FieldType = "isPayForCourse" | "isPay" | "isAffiliate" | "status";

export function UsersTable({ data, heading }: Props) {
  const [selectedField, setSelectedField] = useState<FieldType | "">("");
  const [fieldValue, setFieldValue] = useState<
    boolean | "Active" | "Inactive" | null
  >(null);
  const [selectedUserForPackage, setSelectedUserForPackage] = useState<
    string | null
  >(null);

  // React Hook Form for package link
  const packageForm = useForm<PackageLinkFormValues>({
    defaultValues: {
      link: "",
    },
  });

  const { deleteUser, updateUserStatus, updateUserPakageLink } =
    useUserActions();

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

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("Failed to delete user");
    }
  };

  const handlePakageLink = async (feilds: { packageLink: string; userId: string }) => {
    try {
      const res = await updateUserPakageLink(feilds);
      console.log("res handle pakge", res);
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("Failed to update pakage link");
    }
  };

  const handlePackageLinkSubmit = async (values: PackageLinkFormValues) => {
    if (!selectedUserForPackage) return;

    try {
      await handlePakageLink({
        userId: selectedUserForPackage,
        packageLink: values.link,
      });
      packageForm.reset();
      setSelectedUserForPackage(null);
      toast.success("Package link updated successfully!");
    } catch (error) {
      toast.error("Failed to update package link");
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
    <div>
      <div className="flex justify-center h-full">
        <h1 className="text-2xl md:text-3xl font-bold text-main">
          Active Users
        </h1>
      </div>
      <Table>
        <TableCaption>A list of your recent users.</TableCaption>
        <TableHeader>
          <TableRow>
            {heading?.map((head) => (
              <TableHead key={head} className="w-[100px]">
                {head}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.status}</TableCell>
              <TableCell>{user?.role}</TableCell>
              <TableCell className="text-right">
                {user?.earnings || 0}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size={"sm"}
                  onClick={() => handleDelete(user?._id || "")}
                >
                  Delete
                </Button>
              </TableCell>
              <TableCell className="text-right">
                <form
                  onSubmit={(e) => handleSubmit(e, user._id)}
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
              <TableCell className="text-right">
                <Dialog
                  open={selectedUserForPackage === user._id}
                  onOpenChange={(open) =>
                    setSelectedUserForPackage(open ? user._id : null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button
                      size={"sm"}
                      variant="destructive"
                      onClick={() => setSelectedUserForPackage(user._id)}
                    >
                      Set Package Link
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="bg-black text-white border border-gray-700">
                    <DialogHeader>
                      <DialogTitle>
                        Set Package Link for {user.name}
                      </DialogTitle>
                    </DialogHeader>

                    <Form {...packageForm}>
                      <form
                        onSubmit={packageForm.handleSubmit(
                          handlePackageLinkSubmit
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={packageForm.control}
                          name="link"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder="Enter package link"
                                  {...field}
                                  required
                                  className="bg-gray-800 text-white placeholder:text-gray-400 border-gray-700"
                                />
                              </FormControl>
                              <FormMessage className="text-red-400" />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setSelectedUserForPackage(null)}
                            className="bg-gray-700 text-white hover:bg-gray-600"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Save Link
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">
              {data?.reduce(
                (total, user) => total + Number(user.earnings) || 0,
                0
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
