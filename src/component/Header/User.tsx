"use client";

import { parseCookies, destroyCookie } from "nookies";
import { useEffect, useState } from "react";
import { UserIcon } from "@heroicons/react/24/outline";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function UserMenu() {
  const cookies = parseCookies();
  const t = useTranslations("Header.User");
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    const token = cookies.accessToken;

    if (token) {
      setIsLogin(true);
    }
  }, []);

  if (!isLogin) {
    return (
      <Link href="/login">
        <UserIcon
          width={20}
          height={20}
          color="#7a7e7f"
          className="cursor-pointer hover:opacity-90"
        />
      </Link>
    );
  }

  return (
    <div className="relative group inline-block">
      <div className="cursor-pointer">
        <UserIcon
          width={20}
          height={20}
          color="#7a7e7f"
          className="hover:opacity-90"
        />
      </div>

      <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
        <div className="w-full rounded-lg bg-white shadow-[0px_3px_8px_rgba(0,0,0,0.24)] overflow-hidden">
          <Link
            href="/profile"
            className="block px-4 py-2 hover:bg-gray-100 whitespace-nowrap cursor-pointer"
          >
            {t("info")}
          </Link>

          <button
            onClick={() => {
              destroyCookie(null, "accessToken");
              destroyCookie(null, "refreshToken");
              window.location.reload();
            }}
            className="block w-full px-4 py-2 text-left hover:bg-gray-100 cursor-pointer"
          >
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  );
}
