import { useRequestPaymentMutation } from "@/lib/store/features/api/authApi";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  type: string;
  number: number;
  confirmNumber: number;
};
const PaymentRequested = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [requestPayment,{isLoading,data,isError,isSuccess}] = useRequestPaymentMutation()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(data);
      if(data.number !== data.confirmNumber){
        toast.error("confirm number not matched")
        return
      }
      const result = await requestPayment(data).unwrap();
      toast.success(
        result?.message ||
          "your response submitted successfully please wait for admin confirmation. your account will be active soon"
      );
    } catch (error) {
      console.log(error);
      toast.error("your response submitted failed");
    }
  };

  return (
    <div>
      <div className="p-4 text-center text-xl font-bold">
        <h1>for withdraw money you have to request first</h1>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800 p-4 space-y-1"
      >
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="type"
            className="w-full p-2 bg-gray-700 rounded-lg"
            {...register("type", { required: true })}
          />
          {errors.type && (
            <span className="text-red-500">This field is required</span>
          )}
          <input
            type="number"
            placeholder="number"
            className="w-full p-2 bg-gray-700 rounded-lg"
            {...register("number", { required: true })}
          />
          {errors.number && (
            <span className="text-red-500">This field is required</span>
          )}
          <input
            type="number"
            placeholder="confirmNumber"
            className="w-full p-2 bg-gray-700 rounded-lg"
            {...register("confirmNumber", { required: true })}
          />
          {errors.confirmNumber && (
            <span className="text-red-500">This field is required</span>
          )}
        </div>
        <div className="flex justify-center">
          <button className="px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentRequested;
