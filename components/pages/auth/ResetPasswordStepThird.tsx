"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState, ChangeEvent, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";

interface ResetPasswordStepThirdProps {
    onSubmit: (formData: {
        newPassword: string;
        confirmPassword: string;
    }) => void;
    onBack: () => void;
    isLoading: boolean;
}

export default function ResetPasswordStepThird({
    onSubmit,
    onBack,
    isLoading,
}: ResetPasswordStepThirdProps) {
    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="flex flex-col items-center w-full">
            <div className="mb-4 flex justify-center">
                <Link href={'/'}>
                    <Image
                        src="/new-logo.png"
                        alt="Logo"
                        width={240}
                        height={70}
                        className="object-contain w-[200px]"
                        priority
                    />
                </Link>
            </div>

            {/* Header */}
            <div className="mb-3 w-full text-center">
                <h1 className="text-3xl sm:text-[34px] font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Set New Password
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-400">
                    Create a new password for your account
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="w-full space-y-3">
                {/* New Password */}
                <div className="space-y-2">
                    <label
                        htmlFor="newPassword"
                        className="text-base font-medium text-gray-900 dark:text-gray-200 block"
                    >
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-sky-400 focus:ring-1 focus:ring-sky-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white pr-10 text-sm"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <label
                        htmlFor="confirmPassword"
                        className="text-base font-medium text-gray-900 dark:text-gray-200 block"
                    >
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition-colors focus:border-sky-400 focus:ring-1 focus:ring-sky-400 dark:bg-zinc-900 dark:border-zinc-800 dark:text-white pr-10 text-sm"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full !mt-6 rounded-xl bg-black py-6 text-[16px] text-white cursor-pointer flex items-center justify-center font-medium"
                >
                    {isLoading ? "Setting Password..." : "Set Password"}
                </Button>

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
            </form>
        </div>
    );
}
