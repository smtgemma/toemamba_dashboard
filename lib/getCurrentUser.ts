"use client";

import { getMe } from "@/actions/auth";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// ================= types =================

type Profile = {
  id: string;
  userId: string;
  membershipStatus: string | null;
  createdAt: string;
  updatedAt: string;
};

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  profilePic: string | null;
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | "ORGANIZATION" | "NORMAL_USER";
  isVerified: boolean;
  isSubscribed: boolean;

  Profile: Profile | null;
}

interface CurrentUserHook {
  user: UserData | null;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

// ================= hook =================
export const useCurrentUser = (): any => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getMe();
        if (res && res.data) {
          setUser(res.data);
        } else {
          setUser(null);
          if (Cookies.get("token")) {
            Cookies.remove("token");
            toast.error("Session expired. Please sign in again.");
          }
          router.push("/signin");
        }
      } catch (error) {
        setIsError(true);
        setUser(null);
        if (Cookies.get("token")) {
          Cookies.remove("token");
          toast.error("Session expired. Please sign in again.");
        }
        router.push("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "ADMIN" || user?.role === "SUPER_ADMIN",
  };
};