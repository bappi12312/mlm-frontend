import { getAuthFromCookies } from "@/lib/utils/cookieUtils";
import { url } from "../features/api/authApi";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { User } from "../features/authSlice";

export const useUserActions = () => {
  const { mutate } = useSWRConfig();

  const deleteUser = async (id: string) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      // Optimistic update: remove user immediately from UI
      mutate(`${url}/get-all-users`, (currentData: unknown) => {
        // 1. Type guard for array
        if (!Array.isArray(currentData)) {
          return currentData; // Leave intact for revalidation
        }
      
        // 2. Type guard for User objects
        return currentData.filter((item): item is User => {
          const user = item as User;
          return typeof user._id === 'string' && user._id !== id;
        });
      }, false);

      // Send delete request
      const response = await fetch(`${url}/delete-user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deletion failed");
      }

      // Force revalidation to ensure consistency with server
      mutate(`${url}/get-all-users`);

      toast.success('User deleted successfully');
      return true;
    } catch (error) {
      console.error("Delete error:", error);
      
      // Revert optimistic update on error
      mutate(`${url}/get-all-users`);
      
      toast.error(error instanceof Error ? error.message : "Failed to delete user");
      return false;
    }
  };

  return { deleteUser };
};