import { usePaymentCreationMutation } from "@/lib/store/features/api/authApi";
import { useAppSelector } from "@/lib/store/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import PaymentRequested from "./PaymentRequested";
import PaymentDistribution from "./PaymentDistribution";
import Image from "next/image";

// Define the Inputs type for the form
type Inputs = {
  FromNumber: number;
  ToNumber: number;
  Amount: number;
};

// // Define the User type for type safety
// interface User {
//   photo?: string;
//   name: string;
//   status: string;
//   earnings: number;
//   email: string;
//   referalCode: string;
// }

const ProfileDetals = () => {
  const { user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [paymentCreation, { isLoading}] = usePaymentCreationMutation();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await paymentCreation(data).unwrap();
      toast.success(result?.message || "Your response has been successfully submitted. Please wait for admin confirmation.");
    } catch (error) {
      console.log(error);
      toast.error("Your response submission failed.");
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center flex-col gap-8">
      <div className="w-full md:w-1/2 bg-gray-800 rounded-lg">
        <div className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800">
          <Image
            className="object-cover object-center w-full h-56"
            width={300}
            height={300}
            src={user?.photo || "https://imgs.search.brave.com/m4DXOI6PIc48H-SPuj0r0dPrMAtU6QI_SR1HaGBX3Ak/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9wbGF5/LWxoLmdvb2dsZXVz/ZXJjb250ZW50LmNv/bS90eFpnOERHX2Z1/WURkaGlIMGhhTFlk/NnpIcG9rRnB6WFA5/Z2JfM2xqVkhJOFZl/VnpDa015LVlGWjkt/ZnhYTV9jSHV3bD13/NTI2LWgyOTYtcnc.jpeg"}
            alt="avatar"
          />

          <div className="flex items-center px-6 py-3 bg-gray-900">
            <h1 className="mx-3 text-lg font-semibold text-white capitalize">
              Welcome to the TTO platform
            </h1>
          </div>

          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold text-white capitalize">
              {user?.name}
            </h1>

            <p className="py-2 text-gray-400">
              If you want to enable the referral feature, please activate your account
              <span className="text-white capitalize ml-1">{user?.name}</span>
            </p>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">{user?.status}</h1>
              <h2>{user?.status === "Active" ? "🟢" : "🔴"}</h2>
            </div>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">Earnings: {user?.earnings}</h1>
            </div>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">{user?.email}</h1>
            </div>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">
                Your referral code:{" "}
                <span className="text-emerald-700 font-bold">{user?.referalCode}</span>
                {user?.status !== "Active" && " (This will work after you activate your account)"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 rounded-lg space-y-8">
        <div className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800 p-4 space-y-1 text-center">
          <h1>To activate your account, please invest just 100 Taka to the given number:</h1>
          <div>
            <h2>Bkash: 01795944731</h2>
            <h2>Nogod: 01795944731</h2>
            <h2>Rocket: 01795944731</h2>
          </div>
        </div>

        {/* Invest form */}
        <div>
          <div className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800 p-4 space-y-1">
            <h1 className="text-center font-bold text-xl md:text-2xl">After successfully investing, please fill out this form:</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800 p-4 space-y-1">
            <div className="flex flex-col gap-4">
              <input
                type="number"
                placeholder="From Number"
                className="w-full p-2 bg-gray-700 rounded-lg"
                {...register("FromNumber", { required: "From Number is required" })}
              />
              {errors.FromNumber && <span className="text-red-500">{errors.FromNumber.message}</span>}

              <input
                type="number"
                placeholder="To Number"
                className="w-full p-2 bg-gray-700 rounded-lg"
                {...register("ToNumber", { required: "To Number is required" })}
              />
              {errors.ToNumber && <span className="text-red-500">{errors.ToNumber.message}</span>}

              <input
                type="number"
                placeholder="Amount"
                className="w-full p-2 bg-gray-700 rounded-lg"
                {...register("Amount", { required: "Amount is required" })}
              />
              {errors.Amount && <span className="text-red-500">{errors.Amount.message}</span>}
            </div>

            <div className="flex justify-center">
              <button className="px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>

          {user?.status === "Active" && Number(user?.earnings) > 0 && <PaymentRequested />}
          {user?.status === "Active" && <PaymentDistribution />}
        </div>
      </div>
    </div>
  );
};

export default ProfileDetals;
