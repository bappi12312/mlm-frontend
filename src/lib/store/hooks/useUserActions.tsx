import { getAuthFromCookies } from "@/lib/utils/cookieUtils";
import { url } from "../features/api/authApi";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
import { User } from "@/types/types";
import { CoursePakage, Payment,PaymentRequest } from "@/types/types";

export interface Update {
  status?: "Active" | "Inactive";
  isPay?: boolean;
  isAffiliate?: boolean;
  isPayForCourse?: boolean;
}

export interface PackagelinkUpdate {
  packageLink: string;
  userId: string;
}

interface Purchased {
  courseId: string;
  affiliateCode: string;
}

interface UserActions {
  deleteUser: (id: string) => Promise<boolean>;
  createProduct: (formData: FormData) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  getProductById: (id: string) => Promise<CoursePakage | null>;
  getAffiliateSales: (id: string) => Promise<CoursePakage[] | null>;
  updateProduct: (id: string, formData: FormData) => Promise<boolean>;
  updateUserStatus: (id: string, updatedData: Update) => Promise<boolean>;
  updateUserPakageLink: (updatedData: PackagelinkUpdate) => Promise<User | null>;
  coursePurchase: (purChasedData: Purchased) => Promise<boolean>;
  activateAffiliate: (userId : string) => Promise<boolean | null>;
  getAllPayment: () => Promise<Payment[] | null>; 
  getAllPaymentRequest: () => Promise<PaymentRequest[] | null>;
  userCommisson: (id: string,data:{
    amount: number
  }) => Promise<number | null>;
  paymentConfirmation: (data: {userId: string, paymentId: string}) => Promise<User & Payment | null>;
  giveEarningsEachUser: (data : {
    userId : string,
    affiliateAmount? : number,
    amount? : number
  }) => Promise<boolean | null>
  deletePaymentRequest: (id: string) => Promise<boolean | null>;
  deleteAPayment: (id: string) => Promise<boolean | null>;
}

export const useUserActions = (): UserActions => {
  const { mutate } = useSWRConfig();

  const deleteUser = async (id: string) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      // Optimistic update: remove user immediately from UI
      mutate(
        `${url}/get-all-users`,
        (currentData: unknown) => {
          // 1. Type guard for array
          if (!Array.isArray(currentData)) {
            return currentData; // Leave intact for revalidation
          }

          // 2. Type guard for User objects
          return currentData.filter((item): item is User => {
            const user = item as User;
            return typeof user._id === "string" && user._id !== id;
          });
        },
        false
      );

      // Send delete request
      const response = await fetch(`${url}/delete-user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deletion failed");
      }

      // Force revalidation to ensure consistency with server
      mutate(`${url}/get-all-users`);

      toast.success("User deleted successfully");
      return true;
    } catch (error) {
      console.error("Delete error:", error);

      // Revert optimistic update on error
      mutate(`${url}/get-all-users`);

      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
      return false;
    }
  };

  const deleteAPayment = async (id: string) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      // Optimistic update: remove user immediately from UI
      mutate(
        `${url}/getAllPayment`,
        (currentData: unknown) => {
          // 1. Type guard for array
          if (!Array.isArray(currentData)) {
            return currentData; // Leave intact for revalidation
          }

          // 2. Type guard for User objects
          return currentData.filter((item): item is Payment => {
            const user = item as Payment;
            return typeof user._id === "string" && user._id !== id;
          });
        },
        false
      );

      // Send delete request
      const response = await fetch(`${url}/delete-a-payment/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deletion failed");
      }

      // Force revalidation to ensure consistency with server
      mutate(`${url}/getAllPayment`);

      return true;
    } catch (error) {
      console.error("Delete error:", error);

      // Revert optimistic update on error
      mutate(`${url}/getAllPayment`);

      toast.error(
        error instanceof Error ? error.message : "Failed to delete payment"
      );
      return false;
    }
  };

  const deletePaymentRequest = async (id: string) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      // Optimistic update: remove user immediately from UI
      mutate(
        `${url}/get-allPayment-request`,
        (currentData: unknown) => {
          // 1. Type guard for array
          if (!Array.isArray(currentData)) {
            return currentData; // Leave intact for revalidation
          }

          // 2. Type guard for User objects
          return currentData.filter((item): item is PaymentRequest => {
            const user = item as PaymentRequest;
            return typeof user._id === "string" && user._id !== id;
          });
        },
        false
      );

      // Send delete request
      const response = await fetch(`${url}/delete-payment-request/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deletion failed");
      }

      // Force revalidation to ensure consistency with server
      mutate(`${url}/get-allPayment-request`);

      toast.success("Payment request deleted successfully");
      return true;
    } catch (error) {
      console.error("Delete error:", error);

      // Revert optimistic update on error
      mutate(`${url}/get-allPayment-request`);

      toast.error(
        error instanceof Error ? error.message : "Failed to delete payment request"
      );
      return false;
    }
  }

  const createProduct = async (formData: FormData) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      const response = await fetch(`${url}/create-course`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData, // Send FormData directly
      });

      const responseText = await response.text();

      if (!response.ok) {
        const errorMessage = responseText.startsWith("<!DOCTYPE")
          ? extractErrorMessageFromHTML(responseText)
          : JSON.parse(responseText).message;

        throw new Error(errorMessage || "Request failed");
      }

      return true;
    } catch (error) {
      throw error; // Propagate error to component
    }
  };

  const updateProduct = async (id: string, formData: FormData) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      const response = await fetch(`${url}/update-course/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData, // Send FormData directly
      });

      const responseText = await response.text();

      if (!response.ok) {
        const errorMessage = responseText.startsWith("<!DOCTYPE")
          ? extractErrorMessageFromHTML(responseText)
          : JSON.parse(responseText).message;

        throw new Error(errorMessage || "Request failed");
      }

      return true;
    } catch (error) {
      throw error; // Propagate error to component
    }
  };

  const deleteProduct = async (id: string) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      const response = await fetch(`${url}/delete-course/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Deletion failed");
      }

      return true;
    } catch (error) {
      throw error; // Propagate error to component
    }
  };

  const getProductById = async (id: string) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return null;
    }

    try {
      const response = await fetch(`${url}/get-course-by-id/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch product");
      }

      return await response.json();
    } catch (error) {
      throw error; // Propagate error to component
    }
  };

  const getAffiliateSales = async (id: string) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return null;
    }

    try {
      const response = await fetch(
        `${url}/affiliate-sales/${id}?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch sales");
      }

      return await response.json();
    } catch (error) {
      throw error; // Propagate error to component
    }
  };

  const updateUserStatus = async (id: string, updatedData: Update) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      const response = await fetch(`${url}/update-user-status/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user status");
      }

      return true;
    } catch (error) {
      throw error; // Propagate error to component
    }
  };

  const updateUserPakageLink = async (updatedData: PackagelinkUpdate) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      const response = await fetch(`${url}/update-pakage-link`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user status");
      }

      return await response.json();
    } catch (error) {
      throw error; // Propagate error to component
    }
  }

  const coursePurchase = async (purChasedData: Purchased) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      const response = await fetch(`${url}/course-purchase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(purChasedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to purchase course");
      }

      return true;
    } catch (error) {
      throw error; // Propagate error
    }
  };

  const activateAffiliate = async (userId : string) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return false;
    }

    try {
      const response = await fetch(`${url}/activate-affiliate/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to activate affiliate");
      }

      return true;
    } catch (error) {
      console.error("Error:", error);
      throw error;
       // Propagate error to component
    }
  };

  const userCommisson = async (id: string,data: {amount: number}) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return null;
    }

    try {
      const response = await fetch(`${url}/get-user-commission/${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user commission");
      }

      return await response.json();
    } catch (error) {
      throw error; // Propagate error to component
    }
  }

  const getAllPayment = async () => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return null;
    }

    try {
      const response = await fetch(`${url}/getAllPayment`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch payment");
      }

      return await response.json();
    } catch (error) {
      throw error; // Propagate error to component
    }
  };

  const getAllPaymentRequest = async () => {

    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return null;
    }

    try {
      const response = await fetch(`${url}/get-allPayment-request`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch payment request");
      }

      return await response.json();
    } catch (error) {
      throw error; // Propagate error to component
    }
  };

  const paymentConfirmation = async (data: {userId: string, paymentId: string}) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return null;
    }

    try {
      const response = await fetch(`${url}/payment-confirmation`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to confirm payment");
      }

      return await response.json();
    } catch (error) {
      throw error; // Propagate error to component
    }
  }

  const giveEarningsEachUser = async (data : {
    userId : string,
    affiliateAmount? : number,
    amount? : number
  }) => {
    const authToken = getAuthFromCookies()?.accessToken;
    if (!authToken) {
      toast.error("Authentication required");
      return null;
    }

    try {
      const response = await fetch(`${url}/give-earnings-each-user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to give earnings");
      }

      return await response.json();
    } catch (error) {
      throw error; // Propagate error to component
    }
  }


  return {
    deleteUser,
    createProduct,
    deleteProduct,
    getProductById,
    getAffiliateSales,
    updateProduct,
    updateUserStatus,
    coursePurchase,
    activateAffiliate,
    getAllPayment,
    getAllPaymentRequest,
    updateUserPakageLink,
    userCommisson,
    paymentConfirmation,
    giveEarningsEachUser,
    deletePaymentRequest,
    deleteAPayment
  };
};

const extractErrorMessageFromHTML = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.querySelector("pre")?.textContent || "Unknown error";
};
