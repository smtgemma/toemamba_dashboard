"use client";

import { getMe } from "@/actions/auth";
import { useEffect, useState } from "react";

// ================= types =================

type Profile = {
  id: string;
  userId: string;
  bio: string | null;
  gender: string | null;
  address: string | null;
  birthDate: string | null;
  creativeFields: string[];
  age: number | null;
  nationality: string | null;
  country: string | null;
  website: string | null;
  instagram: string | null;
  contactEmail: string | null;
  membershipStatus: string | null;
  createdAt: string;
  updatedAt: string;
};

type Subscription = {
  id: string;
  planName: string;
  startDate: string;
  endDate: string;
  plan: any;
} | null;

export interface UserData {
  id: string;
  email: string;
  fullName: string;
  profilePic: string | null;
  role: "USER" | "ADMIN" | "SUPER_ADMIN" | "ORGANIZATION" | "NORMAL_USER";
  isVerified: boolean;
  isSubscribed: boolean;
  planExpiration: string | null;
  Profile: Profile | null;
  Subscription: any;
}

interface CurrentUserHook {
  user: UserData | null;
  isLoading: boolean;
  isError: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOrganization: boolean;
  isArtist: boolean;
  isUser: boolean;
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
    isOrganization: user?.role === "ORGANIZATION",
    isArtist: user?.role === "USER",
    isUser : user?.role ==='NORMAL_USER'
  };
};
