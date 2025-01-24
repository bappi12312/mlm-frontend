"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/lib/store/features/api/authApi";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface APIError {
  message?: string;
  data?: string;
  [key: string]: any; // Allow additional properties if needed
}

const Login = () => {
  const [signupInput, setSignupInput] = useState({
    name: "",
    email: "",
    password: "",
    referredBy: "",
  });
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();
  const router = useRouter();

  const changeInputHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignupInput({ ...signupInput, [name]: value });
    } else {
      setLoginInput({ ...loginInput, [name]: value });
    }
  };

  const handleRegistration = async (type: String) => {
    const inputData: { [key: string]: string } =
      type === "signup" ? signupInput : loginInput;

    if (
      type === "signup" &&
      (!inputData.name || !inputData.email || !inputData.password)
    ) {
      return toast.error("All fields are required for signup.");
    }

    if (type === "login" && (!inputData.email || !inputData.password)) {
      return toast.error("Email and password are required for login.");
    }

    // Add `name` only if type is "login"
    const payload = type === "signup" ? inputData : { ...inputData, name: "" };

    const action = type === "signup" ? registerUser : loginUser;

    // Trigger the action with the payload
    await action(payload as any);
  };

  useEffect(() => {
    if (registerIsSuccess) {
      setLoginInput({
        email: signupInput.email,
        password: signupInput.password,
      });
      toast.success(
        registerData?.message || "Signup successful. You can now log in."
      );
      router.push("/")
    } else if (registerError) {
      // Check if the error is of type FetchBaseQueryError
      if ("data" in registerError) {
        const errorData = registerError.data as APIError;
        toast.error(errorData?.message || "Signup Failed");
      } else {
        // Handle other types of errors (e.g., SerializedError)
        toast.error("An unexpected error occurred during signup.");
      }
    }

    if (loginIsSuccess) {
      toast.success(loginData?.message || "Login successful.");
      router.push("/dashboard"); // Redirect after login
    } else if (loginError) {
      // Check if the error is of type FetchBaseQueryError
      if ("data" in loginError) {
        const errorData = loginError.data as APIError;
        toast.error(errorData?.message || "Login Failed");
      } else {
        // Handle other types of errors (e.g., SerializedError)
        toast.error("An unexpected error occurred during login.");
      }
    }
  }, [registerIsSuccess, registerError, loginIsSuccess, loginError, router]);

  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  aria-label="Name"
                  value={signupInput.name}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="name"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="@gmail.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={signupInput.password}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="password"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="referredBy">Referral Code</Label>
                <Input
                  type="text"
                  name="referredBy"
                  value={signupInput?.referredBy}
                  onChange={(e) => changeInputHandler(e, "signup")}
                  placeholder="Optional referral code"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={registerIsLoading}
                onClick={() => handleRegistration("signup")}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After signup, you'll be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. patel@gmail.com"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new">Password</Label>
                <Input
                  type="password"
                  name="password"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                  placeholder="Eg. xyz"
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={loginIsLoading}
                aria-label={loginIsLoading ? "Logging in" : "Login"}
                onClick={() => handleRegistration("login")}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;
