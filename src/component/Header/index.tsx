import Image from "next/image";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import SwitchLanguage from "../SwitchLanguage";
import { getLocale } from "next-intl/server";
import Category from "./Category";
import UserMenu from "./User";

async function Header() {
  const locale = await getLocale();

  return (
    <header className="flex flex-col bg-white fixed top-0 w-full z-9999">
      <div className="flex justify-between  items-center w-full mx-auto py-1 px-5">
        <Image
          src="/logo-new.png"
          alt="Logo"
          width={100}
          height={100}
          loading="lazy"
        />

        <div className="w-1/3 flex gap-1 items-center border-1 rounded-lg px-1 py-1 border-gray-400">
          <input type="text" className="w-full outline-0 text-black pl-3" />
          <button className="bg-red-500 px-4 py-1.5 rounded-lg cursor-pointer hover:opacity-90">
            <MagnifyingGlassIcon width={20} height={20} color="#fff" />
          </button>
        </div>

        <div className="flex gap-3 items-center">
          <div className="cursor-pointer hover:opacity-90">
            <ShoppingCartIcon width={20} height={20} color="#7a7e7f" />
            <span></span>
          </div>

          <UserMenu />

          <SwitchLanguage locale={locale} />
        </div>
      </div>

      <div className="bg-gray-500 ">
        <Category />
      </div>
    </header>
  );
}

export default Header;
