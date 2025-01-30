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
}

type SignupInput = {
  name: string;
  email: string;
  password: string;
  referredBy: string; // Make it required
};

interface LoginInput {
  email: string;
  password: string;
}

type AuthTab = "signup" | "login";

const Login = () => {
  const [signupInput, setSignupInput] = useState<SignupInput>({
    name: "",
    email: "",
    password: "",
    referredBy: "",
  });
  
  const [loginInput, setLoginInput] = useState<LoginInput>({ 
    email: "", 
    password: "" 
  });

  const [
    registerUser,
    { 
      data: registerData, 
      error: registerError, 
      isLoading: registerIsLoading, 
      isSuccess: registerIsSuccess 
    },
  ] = useRegisterUserMutation();
  
  const [
    loginUser,
    { 
      data: loginData, 
      error: loginError, 
      isLoading: loginIsLoading, 
      isSuccess: loginIsSuccess 
    },
  ] = useLoginUserMutation();
  
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: AuthTab
  ) => {
    const { name, value } = e.target;
    
    if (type === "signup") {
      setSignupInput(prev => ({
        ...prev,
        [name]: value as SignupInput[keyof SignupInput]
      }));
    } else {
      setLoginInput(prev => ({
        ...prev,
        [name]: value as LoginInput[keyof LoginInput]
      }));
    }
  };

  const handleAuthSubmit = async (type: AuthTab) => {
    try {
      if (type === "signup") {
        const { name, email, password } = signupInput;
        if (!name || !email || !password) {
          return toast.error("All fields are required for signup.");
        }
        await registerUser(signupInput).unwrap();
      } else {
        const { email, password } = loginInput;
        if (!email || !password) {
          return toast.error("Email and password are required for login.");
        }
        await loginUser(loginInput).unwrap();
      }
    } catch (error) {
      const errorMessage = (error as APIError)?.message || 
        `Failed to ${type === "signup" ? "sign up" : "log in"}`;
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (registerIsSuccess) {
      setLoginInput({
        email: signupInput.email,
        password: signupInput.password,
      });
      toast.success(registerData?.message || "Signup successful. Please log in.");
    }
  }, [registerIsSuccess, signupInput.email, signupInput.password, registerData?.message]);

  useEffect(() => {
    if (loginIsSuccess) {
      toast.success(loginData?.message || "Login successful.");
      router.push("/dashboard"); // Changed to sensible redirect
    }
  }, [loginIsSuccess, router, loginData?.message]);

  useEffect(() => {
    const error = registerError || loginError;
    if (error) {
      const errorData = 'data' in error ? error.data as APIError : undefined;
      toast.error(errorData?.message || "An error occurred");
    }
  }, [registerError, loginError]);

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
              {Object.entries(signupInput).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                  <Input
                    type={key === "password" ? "password" : "text"}
                    name={key}
                    value={value}
                    onChange={(e) => handleInputChange(e, "signup")}
                    placeholder={key === "referredBy" ? "Optional referral code" : key}
                    required={key !== "referredBy"}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                disabled={registerIsLoading}
                onClick={() => handleAuthSubmit("signup")}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Please wait
                  </>
                ) : "Signup"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(loginInput).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
                  <Input
                    type={key === "password" ? "password" : "email"}
                    name={key}
                    value={value}
                    onChange={(e) => handleInputChange(e, "login")}
                    placeholder={key === "email" ? "example@email.com" : "password"}
                    required
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                disabled={loginIsLoading}
                onClick={() => handleAuthSubmit("login")}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : "Login"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;