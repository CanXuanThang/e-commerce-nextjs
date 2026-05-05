"use client";

import Image from "next/image";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import SwitchLanguage from "../SwitchLanguage";
import Category from "./Category";
import UserMenu from "./User";
import { Link } from "@/i18n/navigation";
import { useQuery } from "@tanstack/react-query";
import { getCartItems } from "@/apis/cartItem";
import { useDispatch, useSelector } from "react-redux";
import { CartItemStates, setCartItem } from "@/slices/cartItem";
import { RootState } from "@/store";
import useGetLocalStorage from "@/hook/useGetLocalStorage";
import { User } from "@/types/auth";
import { getCategories } from "@/apis/category";

function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const dispatch = useDispatch();
  const useInfo = useGetLocalStorage<User>("user");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { cartItems }: CartItemStates = useSelector(
    (state: RootState) => state.cartItem,
  );

  const { data: _ } = useQuery({
    queryKey: ["get-quantity-cart-item"],
    queryFn: async () => {
      const response = await getCartItems();
      dispatch(setCartItem(response.data));
      return response.data;
    },
    enabled: !!useInfo.email && cartItems.length === 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const { data } = useQuery({
    queryKey: ["get-categories"],
    queryFn: getCategories,
  });

  return (
    <header className="fixed top-0 z-[9999] w-full bg-white">
      <div className="overflow-hidden whitespace-nowrap w-full bg-black">
        <div className="flex animate-marquee gap-10 text-white text-xs py-1">
          {t("noti")} 😓😓
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-3 md:px-5 md:py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 border rounded-lg border-gray"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <XMarkIcon width={20} /> : <Bars3Icon width={20} />}
            </button>

            <Link href="/">
              <Image
                src="/logo-new.png"
                alt="Logo"
                width={100}
                height={100}
                className="w-18 md:w-[90px]"
              />
            </Link>
          </div>

          <div className="hidden md:flex w-1/3 items-center border rounded-lg px-2 py-1">
            <input
              type="text"
              placeholder="Search products"
              className="w-full pl-2 outline-none"
            />
            <button className="bg-red-500 px-3 py-1.5 rounded-lg">
              <MagnifyingGlassIcon
                width={18}
                color="#fff"
                className="cursor-pointer"
              />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setIsSearchOpen(true)}>
              <MagnifyingGlassIcon
                width={20}
                color="#7a7e7f"
                className="cursor-pointer"
              />
            </button>

            <Link href={"/payment"} className="relative">
              <ShoppingCartIcon
                width={20}
                color="#7a7e7f"
                className="cursor-pointer"
              />
              {cartItems.length > 0 && (
                <span className="absolute text-[8px] top-[-6px] right-[-6px] flex bg-red-500 w-3.5 h-3.5 justify-center text-center items-center text-white rounded-full font-semibold">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <UserMenu />

            <SwitchLanguage locale={locale} />
          </div>
        </div>
      </div>

      <div className="hidden bg-gray-500 md:block md:rounded-none">
        <Category data={data?.data ?? []} />
      </div>

      {isMenuOpen && (
        <div className="fixed w-full h-full bg-white md:hidden">
          <Category
            data={data?.data ?? []}
            className="flex-col py-2"
            itemClassName="px-4 py-3 hover:bg-white text-xs hover:text-gray-500"
            onNavigate={() => setIsMenuOpen(false)}
          />
        </div>
      )}

      {isSearchOpen && (
        <div className="fixed inset-0 z-[9999] bg-white p-4">
          <div className="flex items-center gap-2 border rounded-lg px-2 py-2">
            <input
              autoFocus
              type="text"
              placeholder="Search products"
              className="w-full outline-none"
            />

            <button className="bg-red-500 px-3 py-2 rounded-lg">
              <MagnifyingGlassIcon width={18} color="#fff" />
            </button>

            <button onClick={() => setIsSearchOpen(false)}>
              <XMarkIcon width={22} />
            </button>
          </div>

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setIsSearchOpen(false)}
          />
        </div>
      )}
    </header>
  );
}

export default Header;
