"use client";

import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

interface Props {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose: () => void;
}

export default function AdminDialog({
  open,
  title,
  description,
  children,
  onClose,
}: Props) {
  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-sm"
        aria-hidden="true"
      ></div>
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-2">
              <div>
                <DialogTitle className="text-xl font-semibold text-slate-900">
                  {title}
                </DialogTitle>
                {description ? (
                  <p className="mt-1 text-sm text-slate-500">{description}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                <XMarkIcon className="size-5" />
              </button>
            </div>
            <div className="px-6 py-5">{children}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
