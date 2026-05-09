"use server";

import { getServerToken } from "./token";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export const getMe = async () => {
  const token = await getServerToken();

  if (!token) return null;

  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;

  return res.json();
};
