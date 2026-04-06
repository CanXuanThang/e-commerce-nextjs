"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Locale } from "next-intl";
import Image from "next/image";
import { ReactNode, startTransition, useEffect, useState } from "react";

export interface Menu {
  id: string;
  name: string;
  children?: ReactNode;
}

interface Props {
  locale: string;
}

const options: Menu[] = [
  {
    id: "vi",
    name: "VI",
    children: <Image src="/svg/vi-flag.svg" alt="vi" width={22} height={22} />,
  },
  {
    id: "en",
    name: "EN",
    children: <Image src="/svg/en-flag.svg" alt="en" width={22} height={22} />,
  },
];

function SwitchLanguage({ locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState<Menu | undefined>(undefined);

  useEffect(() => {
    const option = options.find((x) => x.id === locale);
    if (option) return setValue(option);
    setValue(options[0]);
  }, [locale]);

  const handleChangeOption = (option: Menu) => {
    setValue(option);
    startTransition(() => {
      router.replace(pathname, { locale: option.id });
    });
  };

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white inset-ring-1 inset-ring-white/5 hover:bg-white/20 cursor-pointer outline-0">
        {value?.children ? value.children : (value?.name ?? "")}
        <ChevronDownIcon
          aria-hidden="true"
          className="-mr-1 size-5 text-gray-400"
        />
      </MenuButton>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-fit origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1 flex flex-col gap-1 ">
          {options.length > 0 &&
            options.map((item) => (
              <MenuItem>
                <div
                  className="flex items-center py-0.5 cursor-pointer hover:opacity-90"
                  onClick={() => handleChangeOption(item)}
                  key={item.id}
                >
                  {item?.children ? (
                    <div className="flex items-center gap-1.5 px-1.5">
                      {item.children}
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ) : (
                    <div>{item.name}</div>
                  )}
                </div>
              </MenuItem>
            ))}
        </div>
      </MenuItems>
    </Menu>
  );
}

export default SwitchLanguage;
