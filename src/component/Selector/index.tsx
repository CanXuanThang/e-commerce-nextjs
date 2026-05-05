"use client";

import { Option } from "@/types/common";
import { Popover } from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface Props {
  handleChange: (option: Option) => void;
  options: Option[];
  label: string;
  value?: Option | null;
  hideSearch?: boolean;
}

export default function Selector({
  handleChange,
  options,
  label,
  value = null,
  hideSearch = false,
}: Props) {
  const t = useTranslations("Common");
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  return (
    <Popover className="relative w-full">
      {({ close }) => (
        <>
          <Popover.Button className="flex h-9 w-full cursor-pointer items-center justify-between gap-3 rounded-md border border-gray-400 bg-white px-3 text-sm outline-0">
            <span
              className={`min-w-0 truncate text-left ${value ? "text-gray-900" : "text-gray-400"}`}
            >
              {value?.label || label}
            </span>
            <ChevronDownIcon className="size-4 shrink-0" />
          </Popover.Button>

          <Popover.Panel className="absolute z-50 mt-2 w-full rounded-md border border-gray-400 bg-white p-1.5 shadow-lg">
            {hideSearch ? (
              ""
            ) : (
              <div className="mb-2">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full px-3 py-1 border border-gray-400 rounded-full outline-none text-sm"
                />
              </div>
            )}

            <div className="max-h-[220px] overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  {t("noOptions")}
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      handleChange(option);
                      setQuery("");
                      close();
                    }}
                    className={`flex justify-between items-center px-1.5 py-2 text-sm cursor-pointer rounded-md hover:bg-gray-200 ${value?.value === option.value ? "bg-gray-200" : ""}`}
                  >
                    <span className="min-w-0 pr-2 break-words">
                      {option.label}
                    </span>
                    {value?.value === option.value && (
                      <CheckIcon className="size-4 shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}
