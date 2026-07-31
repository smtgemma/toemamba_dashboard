"use client";

import { getMe } from "@/actions/auth";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getMe();
        setUser(res?.data ?? null);
      } catch (error) {
        setIsError(true);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  return {
    user,
    isLoading,
    isError,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "ADMIN" || user?.role === "SUPER_ADMIN",
  };
};