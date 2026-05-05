"use client";

import { Link } from "@/i18n/navigation";
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

export interface AdminBreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: AdminBreadcrumbItem[];
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function AdminBreadcrumb({
  items,
  title,
  description,
  action,
}: Props) {
  return (
    <div className="space-y-4">
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 px-1 text-sm text-slate-500"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <div
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
            >
              {index === 0 ? <HomeIcon className="size-4" /> : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-slate-900" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast ? <ChevronRightIcon className="size-4" /> : null}
            </div>
          );
        })}
      </nav>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
            {description ? (
              <p className="mt-2 text-sm text-slate-500">{description}</p>
            ) : null}
          </div>

          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
