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
import { User } from "@/types/types";
import { Button } from "@/components/ui/button";


type SubmitHandler<T> = (data: T) => Promise<void>;

type PackageLinkFormValues = {
  link: string; // Ensure 'link' is defined here
  userId: string;
};

type SharedModalProps = {
  user: User;
  selectedUserForPackage: string | null;
  setSelectedUserForPackage: (selectedUserForPackage: string | null) => void;
  packageForm: ReturnType<typeof useForm<PackageLinkFormValues>>;
  handlePackageLinkSubmit: SubmitHandler<PackageLinkFormValues>;
};

const SharedModal = ({ user, selectedUserForPackage, setSelectedUserForPackage,packageForm, handlePackageLinkSubmit } : SharedModalProps) => {
  return (
    <div>
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
    </div>
  )
}

export default SharedModal