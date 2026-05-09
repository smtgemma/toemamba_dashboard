"use client";

import React, { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/lib/redux/features/auth/authApi";

export default function VerifyOtpPage() {
    const [verifyOtp] = useVerifyOtpMutation()
    const [resendOtp] = useResendOtpMutation()
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all fields are filled
        if (newOtp.every((digit) => digit !== "")) {
            // Optional: trigger submit automatically here
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const newOtp = [...otp];
            pastedData.split("").forEach((char, idx) => {
                if (idx < 6) {
                    newOtp[idx] = char;
                }
            });
            setOtp(newOtp);

            const nextEmptyIndex = newOtp.findIndex((val) => val === "");
            const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
            inputRefs.current[focusIndex]?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join("");

        if (otpString.length < 6) {
            toast.error("Please enter all 6 digits.");
            return;
        }

        setIsLoading(true);

        const store = JSON.parse(localStorage.getItem("signUpData") || "{}");

        const data = {
            otp: otpString,
            email: store.email,
        };

        try {

            const res = await verifyOtp(data).unwrap();

            toast.success("OTP verified successfully!");
            localStorage.removeItem("signUpData");
            router.replace("/signin");

        } catch (error: any) {
            const errMsg = error?.data?.message || error?.data?.errorMessages[0]?.message
            toast.error(errMsg || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        const store = JSON.parse(localStorage.getItem("signUpData") || "{}");
        if (!store.email) {
            toast.error("User email not found. Please sign up again.");
            return;
        }

        setIsResending(true);
        try {

            await resendOtp({ email: store.email }).unwrap();

            toast.success("OTP Resent Successfully!");
        } catch (error: any) {
            const errMsg = error?.data?.message || error?.data?.errorMessages[0]?.message
            toast.error(errMsg || "Failed to resend OTP");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="flex h-screen bg-[#f7f8fa] items-center justify-center p-4">
            <div className='max-w-4xl w-full rounded-3xl border border-violet-400 bg-white shadow-sm dark:bg-zinc-950 dark:border-violet-500 overflow-hidden'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
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
                                Verify your identity
                            </h1>
                            <p className="text-sm text-gray-400 dark:text-gray-400">
                                Enter the 6-digit code from your email.
                            </p>
                        </div>

                        {/* OTP Form */}
                        <form onSubmit={handleSubmit} className="w-full space-y-6">
                            <div className="space-y-4">
                                <label className="text-base font-medium text-gray-900 dark:text-gray-200 block">
                                    OTP
                                </label>
                                <div className="flex justify-between space-x-2 sm:space-x-3">
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => {
                                                inputRefs.current[index] = el;
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                handleChange(index, e.target.value)
                                            }
                                            onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                                                handleKeyDown(index, e)
                                            }
                                            onPaste={handlePaste}
                                            className="w-11 h-12 sm:w-14 sm:h-14 text-center text-xl font-semibold border border-gray-200 rounded-xl focus:outline-none transition-colors focus:border-sky-400 focus:ring-1 focus:ring-sky-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                                            required
                                        />
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full rounded-xl btn-gradient py-6 text-lg text-white cursor-pointer flex items-center justify-center font-semibold"
                                disabled={isLoading}
                            >
                                <CheckCircle2 className="mr-2 h-5 w-5" />
                                {isLoading ? "Verifying..." : "Verify OTP"}
                            </Button>
                        </form>

                        <div className="mt-6 flex w-full max-w-[80%] items-center justify-center space-x-2">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-zinc-700"></div>
                            <span className="text-xs font-semibold text-gray-300">-</span>
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-zinc-700"></div>
                        </div>

                        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                            Didn't receive the code?{" "}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isResending}
                                className="font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-500"
                            >
                                {isResending ? "Sending..." : "Send Code"}
                            </button>
                        </p>
                    </div>

                    <div className="hidden lg:block relative h-[520px] w-full">
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
