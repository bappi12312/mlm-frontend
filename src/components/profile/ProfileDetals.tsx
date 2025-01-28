import { useAppSelector } from "@/lib/store/hooks";

// "use client"
const ProfileDetals = () => {
  const { user } = useAppSelector((state) => state.auth);
  return (
    <div className="w-full h-full flex justify-center items-center">
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
                your referral code: <span className="text-emerald-700 font-bold">{user && user.referalCode}</span> this will work after active your account
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetals;
