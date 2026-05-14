"use client";

import SwitchLanguage from "@/component/SwitchLanguage";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { AdminLocale } from "@/types/admin";
import {
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  PhotoIcon,
  QueueListIcon,
  ShoppingBagIcon,
  TagIcon,
  UserCircleIcon,
  UsersIcon,
  XMarkIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import Image from "next/image";
import { ReactNode, useState } from "react";
import { destroyCookie } from "nookies";
import { useTranslations } from "next-intl";
import useGetLocalStorage from "@/hook/useGetLocalStorage";
import { User } from "@/types/auth";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useSocket } from "@/hook/useSocket";
import { CommonStates, setNotificationCount } from "@/slices/common";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { getCount } from "@/apis/order";

interface Props {
  locale: AdminLocale;
  children: ReactNode;
}

const navIcons = {
  dashboard: AdjustmentsHorizontalIcon,
  users: UsersIcon,
  products: ShoppingBagIcon,
  categories: TagIcon,
  banners: PhotoIcon,
  orders: QueueListIcon,
};

const navItems = [
  { key: "dashboard", href: "/admin" },
  { key: "users", href: "/admin/users" },
  { key: "products", href: "/admin/products" },
  { key: "categories", href: "/admin/categories" },
  { key: "banners", href: "/admin/banners" },
  { key: "orders", href: "/admin/orders" },
] as const;

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function AdminShell({ locale, children }: Props) {
  useSocket();
  const dispatch = useDispatch();
  const t = useTranslations("Admin");
  const userInfo = useGetLocalStorage<User>("user");
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { countNotiAdmin }: CommonStates = useSelector(
    (state: RootState) => state.common,
  );

  const {} = useQuery({
    queryKey: ["get-noti-count"],
    queryFn: async () => {
      const count = await getCount();

      if (count.success) {
        dispatch(setNotificationCount(count.data.count));
      }
      return;
    },
  });

  const handleLogout = () => {
    destroyCookie(null, "accessToken");
    destroyCookie(null, "refreshToken");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,114,24,0.14),_transparent_30%),linear-gradient(180deg,_#fffdf8_0%,_#f8fafc_100%)] text-slate-950">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="flex h-[72px] items-center justify-between gap-4 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-2xl border border-slate-200 p-2 text-slate-700 lg:hidden"
            >
              <Bars3Icon className="size-6" />
            </button>
            <Link href="/admin/users" className="flex items-center gap-3">
              <Image
                src="/logo3.png"
                alt="logo"
                width={100}
                height={100}
                className="w-18 md:w-[90px]"
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href={"/admin/order"} className="relative">
              <ShoppingCartIcon
                width={20}
                color="#7a7e7f"
                className="cursor-pointer"
              />
              {countNotiAdmin > 0 && (
                <span className="absolute text-[8px] top-[-6px] right-[-6px] flex bg-red-500 w-3.5 h-3.5 justify-center text-center items-center text-white rounded-full font-semibold">
                  {countNotiAdmin}
                </span>
              )}
            </Link>
            <SwitchLanguage locale={locale} />

            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:border-slate-300">
                <UsersIcon width={20} height={20} />
                <div className="hidden text-left md:block">
                  <p className="text-sm font-semibold text-slate-900 uppercase">
                    {userInfo?.name ?? ""}
                  </p>
                  <p className="text-xs text-slate-500">
                    {userInfo?.email ?? ""}
                  </p>
                </div>
              </MenuButton>
              <MenuItems className="absolute right-0 z-20 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl outline-none">
                <MenuItem>
                  <Link
                    href="/admin/profile"
                    className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 transition data-focus:bg-slate-100"
                  >
                    <UserCircleIcon width={20} height={20} />
                    <span>{t("profile")}</span>
                  </Link>
                </MenuItem>
                <MenuItem>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm text-rose-600 transition data-focus:bg-rose-50"
                  >
                    <ArrowRightStartOnRectangleIcon className="size-5" />
                    <span>{t("logout")}</span>
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-72 shrink-0 border-r border-slate-200 bg-white/80 px-4 py-6 lg:block">
          <ListNav handleOpenSidebar={(value) => setIsSidebarOpen(value)} />
        </aside>

        {isSidebarOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-slate-950/35"
            />
            <aside className="absolute left-0 top-0 h-full w-72 bg-white px-4 py-6 shadow-2xl">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-lg font-semibold text-slate-900">
                  {t("menu")}
                </p>
                <button
                  type="button"
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-xl border border-slate-200 p-2 text-slate-700"
                >
                  <XMarkIcon className="size-5" />
                </button>
              </div>
              <ListNav handleOpenSidebar={(value) => setIsSidebarOpen(value)} />
            </aside>
          </div>
        ) : null}

        <main className="min-w-0 flex-1 px-4 py-6 md:px-6 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

interface ListNavProps {
  handleOpenSidebar: (value: boolean) => void;
}

const ListNav = ({ handleOpenSidebar }: ListNavProps) => {
  const t = useTranslations("Admin");
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const Icon = navIcons[item.key];
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.key}
            href={item.href}
            onClick={() => handleOpenSidebar(false)}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
              isActive
                ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
            )}
          >
            <Icon className="size-5 shrink-0" />
            <span>{t(`nav.${item.key}`)}</span>
          </Link>
        );
      })}
    </nav>
  );
};
