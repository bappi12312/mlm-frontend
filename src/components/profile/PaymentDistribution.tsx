import { useDistributeCommissionMutation } from "@/lib/store/features/api/authApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

// Type for form input
type Inputs = {
  amount: number;
};

// Error handling for the API request
type ApiError = {
  message: string;
};

const PaymentDistribution = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [distributeCommission, { isLoading}] =
    useDistributeCommissionMutation();

  // Form submission handler
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await distributeCommission({ amount: data.amount }).unwrap();
      toast.success(result?.message || "Payment distributed successfully.");
    } catch (error) {
      const typedError = error as ApiError; // Type the error
      console.error(typedError.message);
      toast.error(typedError?.message || "Payment distribution failed.");
    }
  };

  return (
    <div>
      <div className="p-4 text-center text-xl font-bold">
        <h1>Fill this form after activating your account</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800 p-4 space-y-1"
      >
        <div className="flex flex-col gap-4">
          <input
            type="number"
            placeholder="Number"
            className="w-full p-2 bg-gray-700 rounded-lg"
            {...register("amount", { required: true, valueAsNumber: true })}
          />
          {errors.amount && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="flex justify-center">
          <button
            className="px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentDistribution;
