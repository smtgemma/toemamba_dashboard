"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, FormEvent } from "react";

interface ResetPasswordStepFirstProps {
    email: string;
    onChange: (email: string) => void;
    onSubmit: (e: FormEvent) => void;
    isLoading: boolean;
}

export default function ResetPasswordStepFirst({
    email,
    onChange,
    onSubmit,
    isLoading,
}: ResetPasswordStepFirstProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className="flex flex-col items-center w-full">
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

            {/* Header */}
            <div className="mb-5 w-full text-center">
                <h1 className="text-3xl sm:text-[34px] font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Forget Password
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-400">
                    Enter your correct email to reset your password
                </p>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="w-full space-y-4">
                <div className="space-y-2">
                    <label
                        htmlFor="email"
                        className="text-base font-medium text-gray-900 dark:text-gray-200 block"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        placeholder="xyz@gmail.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-sky-400 focus:ring-1 focus:ring-sky-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white"
                        required
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full !mt-6 rounded-xl btn-gradient py-6 text-lg text-white cursor-pointer flex items-center justify-center font-semibold"
                >
                    {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>

                {/* Back to Sign In */}
                <div className="text-center mt-6">
                    <Link
                        href="/signin"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-500"
                    >
                        Back to Sign In
                    </Link>
                </div>
            </form>
        </div>
    );
}
