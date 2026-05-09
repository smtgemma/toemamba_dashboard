"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";

interface ResetPasswordStepSecondProps {
    email: string;
    onVerify: (otp: string) => void;
    onResend: () => void;
    onBack: () => void;
    isLoading: boolean;
}

export default function ResetPasswordStepSecond({
    email,
    onVerify,
    onResend,
    onBack,
    isLoading,
}: ResetPasswordStepSecondProps) {
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
        if (newOtp.every((digit) => digit !== "") && index === 5) {
            onVerify(newOtp.join(""));
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

            // Auto-submit if all fields are filled
            if (newOtp.every((digit) => digit !== "")) {
                onVerify(newOtp.join(""));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join("");
        onVerify(otpString);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="mb-4 flex justify-center">
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

            {/* Header */}
            <div className="mb-5 w-full text-center">
                <h1 className="text-3xl sm:text-[34px] font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Verify Your OTP
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-400 mb-1">
                    Enter the code we've sent to:
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
                    {email}
                </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-6">
                <div className="space-y-4">
                    <label className="text-base font-medium text-gray-900 dark:text-gray-200 block">
                        Enter 6-digit code
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
                    disabled={isLoading}
                    className="w-full !mt-4 rounded-xl bg-black py-6 text-[16px] text-white cursor-pointer flex items-center justify-center font-medium"
                >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <div className="text-center pt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Didn't get the code?{" "}
                        <button
                            type="button"
                            onClick={onResend}
                            className="font-medium text-blue-600 hover:text-blue-500 hover:underline transition focus:outline-none dark:text-blue-500"
                        >
                            Resend it
                        </button>
                    </p>
                </div>
            </form>

            <div className="w-full flex justify-between items-center mt-8 px-2">
                <button
                    type="button"
                    className="text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                    onClick={onBack}
                >
                    &larr; Back
                </button>
                <Link
                    href="/signin"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-500"
                >
                    Back to Sign In
                </Link>
            </div>
        </div>
    );
}
