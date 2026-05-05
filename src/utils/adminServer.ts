import { BaseResponse } from "@/types/common";
import { UserResponse } from "@/types/user";
import { cookies } from "next/headers";

export async function getAdminUsers(locale: string): Promise<UserResponse[]> {
  const baseUrl = process.env.NEXT_PUBLIC_URL_API;

  if (!baseUrl) {
    return [];
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  try {
    const response = await fetch(new URL("/users", baseUrl), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "Client-Type": "Web",
        "X-Language": locale,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    });

    if (!response.ok) {
      return [];
    }

    const payload = (await response.json()) as BaseResponse<UserResponse[]>;
    return payload.data ?? [];
  } catch {
    return [];
  }
}
