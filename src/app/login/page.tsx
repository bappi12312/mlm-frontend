"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLoginUserMutation, useRegisterUserMutation } from "@/lib/store/features/api/authApi";

interface APIError {
  message?: string;
  data?: string;
}

type SignupInput = {
  name: string;
  email: string;
  password: string;
  referredBy: string;
};

interface LoginInput {
  email: string;
  password: string;
}

type AuthTab = "signup" | "login";

const Login = () => {
  const [tab, setTab] = useState<AuthTab>("login");
  const [signupInput, setSignupInput] = useState<SignupInput>({ name: "", email: "", password: "", referredBy: "" });
  const [loginInput, setLoginInput] = useState<LoginInput>({ email: "", password: "" });

  const [registerUser, { data: registerData, error: registerError, isLoading: registerIsLoading, isSuccess: registerIsSuccess }] = useRegisterUserMutation();
  const [loginUser, { data: loginData, error: loginError, isLoading: loginIsLoading, isSuccess: loginIsSuccess }] = useLoginUserMutation();

  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: AuthTab
  ) => {
    const { name, value } = e.target;

    if (type === "signup") {
      setSignupInput((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginInput((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAuthSubmit = async (type: AuthTab) => {
    try {
      if (type === "signup") {
        const { name, email, password, referredBy } = signupInput;
        if (!name || !email || !password || !referredBy) return toast.error("নিবন্ধনের জন্য সকল ফিল্ড পূরণ করুন।");
        await registerUser(signupInput).unwrap();
      } else {
        const { email, password } = loginInput;
        if (!email || !password) return toast.error("লগইনের জন্য ইমেইল ও পাসওয়ার্ড প্রয়োজন");
        await loginUser(loginInput).unwrap();
      }
    } catch (error) {
      const errorMessage = (error as APIError)?.message || (type === "signup" ? "নিবন্ধন করতে ব্যর্থ হয়েছে" : "লগইন করতে ব্যর্থ হয়েছে");
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (registerIsSuccess && registerData) {
      setLoginInput({ email: signupInput.email, password: signupInput.password });
      toast.success(registerData.message || "নিবন্ধন সফল! অনুগ্রহ করে লগইন করুন");
    }
  }, [registerIsSuccess, signupInput, registerData]);

  useEffect(() => {
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "সফলভাবে লগইন হয়েছে");
      router.push("/dashboard");
    }
  }, [loginIsSuccess, router, loginData]);

  useEffect(() => {
    const error = registerError || loginError;
    if (error && "data" in error) {
      const errorData = error.data as APIError;
      toast.error(errorData?.message || "একটি সমস্যা হয়েছে");
    }
  }, [registerError, loginError]);

  return (
    <div className="flex items-center w-full justify-center mt-20">
      <Tabs value={tab} onValueChange={(value) => setTab(value as AuthTab)} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">নিবন্ধন</TabsTrigger>
          <TabsTrigger value="login">লগইন</TabsTrigger>
        </TabsList>

        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>নিবন্ধন</CardTitle>
              <CardDescription>
                একটি নতুন অ্যাকাউন্ট তৈরি করুন এবং সম্পন্ন হলে নিবন্ধন ক্লিক করুন
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(signupInput).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={key}>
                    {{
                      name: "নাম",
                      email: "ইমেইল",
                      password: "পাসওয়ার্ড",
                      referredBy: "রেফার কোড"
                    }[key]}
                  </Label>
                  <Input
                    type={key === "password" ? "password" : "text"}
                    name={key}
                    value={value}
                    onChange={(e) => handleInputChange(e, "signup")}
                    required={key !== "referredBy"}
                    placeholder={key === "referredBy" ? "ঐচ্ছিক" : ""}
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button disabled={registerIsLoading} onClick={() => handleAuthSubmit("signup")}>
                {registerIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "নিবন্ধন করুন"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>লগইন</CardTitle>
              <CardDescription>আপনার অ্যাকাউন্টে প্রবেশ করতে ক্রেডেনশিয়াল লিখুন</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(loginInput).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label htmlFor={key}>
                    {{
                      email: "ইমেইল",
                      password: "পাসওয়ার্ড"
                    }[key]}
                  </Label>
                  <Input
                    type={key === "password" ? "password" : "email"}
                    name={key}
                    value={value}
                    onChange={(e) => handleInputChange(e, "login")}
                    placeholder={{
                      email: "উদাহরণ: example@email.com",
                      password: "পাসওয়ার্ড"
                    }[key]}
                    required
                  />
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button disabled={loginIsLoading} onClick={() => handleAuthSubmit("login")}>
                {loginIsLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "লগইন করুন"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Login;