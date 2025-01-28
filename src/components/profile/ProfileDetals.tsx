import { usePaymentCreationMutation } from "@/lib/store/features/api/authApi";
import { useAppSelector } from "@/lib/store/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  FromNumber: number;
  ToNumber: number;
  Amount: number;
};
const ProfileDetals = () => {
  const { user } = useAppSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [paymentCreation] =
    usePaymentCreationMutation();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const result = await paymentCreation(data).unwrap();
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
    <div className="w-full h-full flex justify-center items-center flex-col gap-8">
      <div className="w-full md:w-1/2 bg-gray-800 rounded-lg">
        <div className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800">
          <img
            className="object-cover object-center w-full h-56"
            src={
              (user && user.photo) ||
              "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
            }
            alt="avatar"
          />

          <div className="flex items-center px-6 py-3 bg-gray-900">
            <h1 className="mx-3 text-lg font-semibold text-white capitalize">
              welcome to tto platform
            </h1>
          </div>

          <div className="px-6 py-4">
            <h1 className="text-xl font-semibold  text-white capitalize ">
              {user && user.name}
            </h1>

            <p className="py-2 text-gray-400 ">
              if you want to enable referral feature please active you account
              <span className="text-white capitalize ml-1">
                {user && user.name}
              </span>
            </p>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">{user && user.status}</h1>
              <h2>{user && user.status === "active" ? "🟢" : "🔴"}</h2>
            </div>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">
                earnings:
                {user && user.earnings}
              </h1>
            </div>

            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">{user && user.email}</h1>
            </div>
            <div className="flex items-center mt-4 text-gray-200">
              <h1 className="px-2 text-sm">
                your referral code:{" "}
                <span className="text-emerald-700 font-bold">
                  {user && user.referalCode}
                </span>{" "}
                this will work after active your account
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-1/2  rounded-lg space-y-8">
        <div className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800 p-4 space-y-1 text-center">
          <h1>
            To Active Your Account please invest just 100 Taka to the given
            number :{" "}
          </h1>
          <div>
            <h2>Bkash: 01795944731</h2>
            <h2>nogod: 01795944731</h2>
            <h2>rocket: 01795944731</h2>
          </div>
        </div>

        {/* inves form */}
        <div>
          <div className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800 p-4 space-y-1">
            <h1 className="text-center font-bold text-xl md:text-2xl">
              After successfully invest please fill this form:{" "}
            </h1>
          </div>
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full overflow-hidden rounded-lg shadow-lg bg-gray-800 p-4 space-y-1"
            >
              <div className="flex flex-col gap-4">
                <input
                  type="number"
                  placeholder="From Number"
                  className="w-full p-2 bg-gray-700 rounded-lg"
                  {...register("FromNumber", { required: true })}
                />
                {errors.FromNumber && (
                  <span className="text-red-500">This field is required</span>
                )}
                <input
                  type="number"
                  placeholder="To Number"
                  className="w-full p-2 bg-gray-700 rounded-lg"
                  {...register("ToNumber", { required: true })}
                />
                {errors.ToNumber && (
                  <span className="text-red-500">This field is required</span>
                )}
                <input
                  type="number"
                  placeholder="Amount"
                  className="w-full p-2 bg-gray-700 rounded-lg"
                  {...register("Amount", { required: true })}
                />
                {errors.Amount && (
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
        </div>
      </div>
    </div>
  );
};

export default ProfileDetals;
