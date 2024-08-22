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

function RegisterForm() {
  const loginSchema = z.object({
    name: z.string().trim().optional(),
    email: z.string().trim().min(1, "Email is required").email("Invalid email address"),
    password: z.string().trim().min(6, "Password must be at least 6 characters"),
  });
  type LoginValues = z.infer<typeof loginSchema>;

  const router = useRouter();
  const { login } = useAuthContext();
  const [isPending, setIsPending] = useState<boolean>(false);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    setError,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<LoginValues> = async values => {
    try {
      setIsPending(true);
      const response = await api.post("/user/signin", values);

      if (response.status === 401) {
        throw new Error("Invalid email or password");
      }

      const authHeader = response?.headers?.["Authorization"];

      if (authHeader) {
        const token = authHeader.replace("Bearer ", "");
        localStorage.setItem("token", token);
      }
      login();
      router.push("/");
    } catch (error: any) {
      setError("email", { type: "manual", message: "Invalid email or password" });
      toast.error("Invalid email or password");
    } finally {
      setIsPending(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto bg-transparent p-8 text-white md:w-[40%] md:text-black md:auth-form"
      >
        <h2 className="text-2xl font-semibold text-center mb-16">Signin to your account</h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input
                      type="name"
                      placeholder="Eg. singh"
                      {...field}
                      className="input-auth"
                    />
                  </FormControl>
                  <FormMessage>
                  {errors.name && errors.name.message}
                    {/* {errors.name && errors.name.message} */}
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>
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
                <FormMessage>
                  {errors.email && errors.email.message}
                </FormMessage>
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
                  <Input
                    type="password"
                    placeholder="Eg. welcome"
                    {...field}
                    className="input-auth"
                  />
                </FormControl>
                <FormMessage>
                  {errors.password && errors.password.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <Button variant={"auth"}  type="submit" className="button-auth mt-10 w-full">
          {isPending ? "Signing in..." : "Sign in"}
        </Button>

        <span className="text-sm block text-center mt-10">
          {" Don't have an account?"}
          <Link href="/auth/login" className="text-blue-500 ml-4">
            Sign up
          </Link>
        </span>
      </form>
    </Form>
  );
}

export default RegisterForm;
