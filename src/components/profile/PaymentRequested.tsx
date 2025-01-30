import { useRequestPaymentMutation } from "@/lib/store/features/api/authApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

// Define the input types for better safety
type Inputs = {
  type: string;
  number: number;
  confirmNumber: number;
};

type ApiError = {
  message: string;
};

const PaymentRequested = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  // Extract mutation status states
  const [requestPayment, { isLoading, isError, isSuccess }] = useRequestPaymentMutation();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (data.number !== data.confirmNumber) {
      toast.error("Confirm number does not match.");
      return;
    }

    try {
      const result = await requestPayment(data).unwrap();
      toast.success(
        result?.message || "Your response has been submitted successfully. Please wait for admin confirmation. Your account will be active soon."
      );
    } catch (error) {
      const typedError = error as ApiError;
      console.error(typedError.message);
      toast.error(typedError?.message || "Your response submission failed.");
    }
  };

  return (
    <div>
      <div className="p-4 text-center text-xl font-bold">
        <h1>To withdraw money, you must request it first.</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800 p-4 space-y-1"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Type"
            className="w-full p-2 bg-gray-700 rounded-lg"
            {...register("type", { required: "Type is required." })}
          />
          {errors.type && <span className="text-red-500">{errors.type.message}</span>}
          
          <input
            type="number"
            placeholder="Number"
            className="w-full p-2 bg-gray-700 rounded-lg"
            {...register("number", { required: "Number is required." })}
          />
          {errors.number && <span className="text-red-500">{errors.number.message}</span>}

          <input
            type="number"
            placeholder="Confirm Number"
            className="w-full p-2 bg-gray-700 rounded-lg"
            {...register("confirmNumber", { required: "Confirm number is required." })}
          />
          {errors.confirmNumber && <span className="text-red-500">{errors.confirmNumber.message}</span>}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {isError && <p className="text-red-500 text-center">There was an error submitting your request.</p>}
      {isSuccess && <p className="text-green-500 text-center">Your request was successfully submitted!</p>}
    </div>
  );
};

export default PaymentRequested;
