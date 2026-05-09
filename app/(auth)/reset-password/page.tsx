"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import ResetPasswordStepFirst from "@/components/pages/auth/ResetPasswordStepFirst";
import ResetPasswordStepSecond from "@/components/pages/auth/ResetPasswordStepSecond";
import ResetPasswordStepThird from "@/components/pages/auth/ResetPasswordStepThird";
import { useForgotPasswordMutation, useResetPasswordMutation, useVerifyResetPassOtpMutation } from "@/lib/redux/features/auth/authApi";



export default function ResetPassPage() {

    const [forgotPassword] = useForgotPasswordMutation()
    const [verifyResetPassOtp] = useVerifyResetPassOtpMutation()
    const [resetPassword] = useResetPasswordMutation()

    const router = useRouter();
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    const handleStep1Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);

        try {

            await forgotPassword({ email }).unwrap();

            toast.success(
                "Verification code sent to your email. Please check your inbox."
            );
            setCurrentStep(2);
        } catch (error: any) {
            const errMsg = error?.data?.message || error?.data?.errorMessages[0]?.message
            toast.error(errMsg || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleVerifyOTP = async (otp: string) => {
        if (isLoading) return;
        setIsLoading(true);
        try {

            await verifyResetPassOtp({ email, otp }).unwrap();


            toast.success("OTP verified successfully!");

            setTimeout(() => {
                setCurrentStep(3);
            }, 500);
        } catch (error: any) {
            const errMsg = error?.data?.message || error?.data?.errorMessages[0]?.message
            toast.error(errMsg || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Handle OTP resend
    const handleResendOTP = async () => {
        try {

            await forgotPassword(email).unwrap();

            toast.success("OTP Resent Successfully!");
        } catch (error: any) {
            const errMsg = error?.data?.message || error?.data?.errorMessages[0]?.message
            toast.error(errMsg || "Something went wrong. Please try again.");
        }
    };

    // Handle step 3 submission
    const handleSetPassword = async (formData: {
        newPassword: string;
        confirmPassword: string;
    }) => {
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        try {

            await resetPassword({
                email,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            }).unwrap();

            toast.success("Password Reset successfully!");
            setTimeout(() => {
                router.push("/signin");
            }, 1000);
        } catch (error: any) {
            const errMsg = error?.data?.message || error?.data?.errorMessages[0]?.message
            toast.error(errMsg || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };


    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    return (
        <div className="flex h-screen bg-[#f7f8fa] items-center justify-center p-4">
            <div className='max-w-4xl w-full rounded-3xl border border-violet-400 bg-white shadow-sm dark:bg-zinc-950 dark:border-violet-500 overflow-hidden'>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
                    <div className="w-full p-4 lg:p-8 flex flex-col items-center justify-center">
                        {currentStep === 1 && (
                            <ResetPasswordStepFirst
                                email={email}
                                onChange={setEmail}
                                onSubmit={handleStep1Submit}
                                isLoading={isLoading}
                            />
                        )}

                        {currentStep === 2 && (
                            <ResetPasswordStepSecond
                                email={email}
                                onVerify={handleVerifyOTP}
                                onResend={handleResendOTP}
                                onBack={handleBack}
                                isLoading={isLoading}
                            />
                        )}

                        {currentStep === 3 && (
                            <ResetPasswordStepThird
                                onSubmit={handleSetPassword}
                                onBack={handleBack}
                                isLoading={isLoading}
                            />
                        )}
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

};
