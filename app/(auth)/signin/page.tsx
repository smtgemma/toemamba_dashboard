import SignIn from "@/components/pages/auth/SignInPage";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";


export default function SignInPage() {

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center" ><Loader2 className="animate-spin size-16 text-primaryBlue" /></div>}>

            <SignIn />
        </Suspense>
    );
}