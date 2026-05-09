"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLoginMutation } from "@/lib/redux/features/auth/authApi";
import { useRouter, useSearchParams } from "next/navigation";

// Zod schema for form validation
const formSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
    rememberMe: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function SignIn() {


    const searchParams = useSearchParams();

    const redirectUrl = searchParams.get("redirect") || "/";


    const [login] = useLoginMutation()
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit = async (data: FormData) => {


        setIsLoading(true);
        const payload = {
            email: data.email,
            password: data.password,
        }

        try {
            const res = await login(payload).unwrap();

            toast.success("Sign in successful.");

            router.replace(redirectUrl);



        } catch (error: any) {
            const errMsg = error?.data?.message || error?.data?.errorMessages[0]?.message
            toast.error(errMsg || "Something went wrong. Please try again.");
            if (error?.data?.statusCode === 403) {
                router.replace("/verify-otp");

            }
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex h-screen  bg-[#f7f8fa] items-center justify-center p-4">

            <div className='max-w-5xl w-full rounded-3xl border border-violet-400 bg-white shadow-sm dark:bg-zinc-950 dark:border-violet-500 overflow-hidden'>


                <div className="grid grid-cols-1 lg:grid-cols-2  gap-3.5 ">

                    <div className="w-full p-4 lg:p-8 flex flex-col items-center">
                        {/* Logo */}
                        <div className="mb-6 flex justify-center">
                            <Link href={'/'}>
                                <Image
                                    src="/logo.png"
                                    alt="PeptideHelp"
                                    width={240}
                                    height={70}
                                    className="object-contain"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="mb-5 w-full text-center">
                            <h1 className="text-3xl sm:text-[34px] font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                Welcome Back
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Sign in to your account to continue
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                            <div className="space-y-3">
                                <label className="text-base font-medium text-gray-900 dark:text-gray-200 ">
                                    Email
                                </label>
                                <input
                                    {...register("email")}
                                    type="email"
                                    className={`mt-1 w-full rounded-xl border px-4 py-3 outline-none transition-colors focus:border-sky-400 focus:ring-1 focus:ring-sky-400 dark:bg-zinc-900 dark:text-white ${errors.email
                                        ? "border-red-500 dark:border-red-500"
                                        : "border-gray-200 dark:border-zinc-800"
                                        }`}
                                    placeholder="Please enter your email address"
                                />
                                {errors.email && (
                                    <p className="text-xs text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className=" text-base font-medium text-gray-900 dark:text-gray-200">
                                    Password
                                </label>
                                <input
                                    {...register("password")}
                                    type="password"
                                    className={`mt-1 w-full rounded-xl border px-4 py-3 outline-none transition-colors focus:border-sky-400 focus:ring-1 focus:ring-sky-400 dark:bg-zinc-900 dark:text-white ${errors.password
                                        ? "border-red-500 dark:border-red-500"
                                        : "border-gray-200 dark:border-zinc-800"
                                        }`}
                                    placeholder="Please enter your password"
                                />
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="flex items-end justify-end  mt-3">

                                <div className="text-sm">
                                    <Link href="/reset-password" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-500">
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full !mt-6 rounded-xl btn-gradient py-6 text-lg font-medium text-white cursor-pointer"
                                disabled={isLoading}
                            >
                                {isLoading ? "Please wait..." : "Login"}
                            </Button>
                        </form>

                        <div className="mt-8 flex w-full max-w-[80%] items-center justify-center space-x-2">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-zinc-700"></div>
                            <span className="text-xs font-semibold text-gray-300">-</span>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-zinc-700"></div>
                        </div>

                        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account?{" "}
                            <Link
                                href="/signup"
                                className="font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-500"
                            >
                                Register
                            </Link>
                        </p>
                    </div>

                    <div className="hidden lg:block relative h-full w-full">
                        <Image
                            src="/auth1.png"
                            alt="Authentication"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                </div>
            </div>

        </div>
    );
}