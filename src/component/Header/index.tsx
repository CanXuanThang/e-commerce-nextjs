import Image from "next/image";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import SwitchLanguage from "../SwitchLanguage";
import { getLocale } from "next-intl/server";

async function Header() {
  const locale = await getLocale();

  return (
    <header className="flex justify-around bg-white items-center w-full">
      <Image
        src="/logo-new.png"
        alt="Logo"
        width={100}
        height={100}
        loading="lazy"
      />

      <div className="w-1/3 flex gap-1 items-center border-2 rounded-lg px-1 py-1">
        <input type="text" className="w-full outline-0 text-black pl-3" />
        <button className="bg-red-500 px-4 py-1.5 rounded-lg cursor-pointer hover:opacity-90">
          <MagnifyingGlassIcon width={20} height={20} />
        </button>
      </div>

      <div className="flex gap-3 items-center">
        <div className="cursor-pointer hover:opacity-90">
          <ShoppingCartIcon width={20} height={20} color="#7a7e7f" />
          <span></span>
        </div>

        <UserIcon
          width={20}
          height={20}
          color="#7a7e7f"
          className="cursor-pointer hover:opacity-90"
        />

        <SwitchLanguage locale={locale} />
      </div>
    </header>
  );
}

export default Header;
