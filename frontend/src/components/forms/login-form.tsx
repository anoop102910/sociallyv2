"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/authContext";
import api from "@/lib/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });
  const router = useRouter();
  const { login } = useAuthContext();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false); // Add this state for password visibility
  type LoginValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<LoginValues> = async values => {
    try {
      setIsPending(true);
      const response = await api.post("/auth/login", values);
      const token = response.data.token;
      localStorage.setItem("token", token);
      login();
      router.push("/");
    } catch (error: any) {
      setError("password", { type: "manual", message: "Invalid email or password" });
      toast.error("Invalid email or password");
    } finally {
      setIsPending(false);
    }
  };

  const handleDemoLogin = () => {
    setValue("email", "demo@example.com");
    setValue("password", "welcome");
    handleSubmit(onSubmit)();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto bg-transparent p-8 text-white md:w-[40%] md:text-black md:auth-form"
      >
        <h2 className="text-2xl font-semibold text-center mb-16">Signin to your account</h2>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Eg. abhishek12@gmail.com"
                    {...field}
                    className="input-auth"
                  />
                </FormControl>
                <FormMessage>{errors.email && errors.email.message}</FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative"> 
                    <Input
                      type={showPassword ? "text" : "password"} 
                      placeholder="Eg. welcome"
                      {...field}
                      className="input-auth pr-10" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer" 
                    >
                      {showPassword ? <EyeOff /> : <Eye />} 
                    </button>
                  </div>
                </FormControl>
                <FormMessage>{errors.password && errors.password.message}</FormMessage>
              </FormItem>
            )}
          />
        </div>

        <Button variant={"auth"} type="submit" className="button-auth mt-10 w-full">
          {isPending ? "Signing in..." : "Sign in"}
        </Button>

        <div className="flex items-center justify-center my-3 space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">OR</span>
        </div>
        <Button variant={"auth"} className="button-auth  w-full" onClick={handleDemoLogin}>
          Use Demo Credentials
        </Button>

        <span className="text-sm block text-center mt-10">
          {" Don't have an account?"}
          <Link href="/auth/register" className="text-blue-500 ml-4">
            Sign up
          </Link>
        </span>
      </form>
    </Form>
  );
}

export default LoginForm;
