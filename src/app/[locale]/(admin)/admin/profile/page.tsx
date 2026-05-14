import AdminBreadcrumb from "@/component/Admin/AdminBreadcrumb";
import { getTranslations } from "next-intl/server";

export default async function Page() {
  const t = await getTranslations("Admin");

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: t("breadcrumb.home"), href: "/admin" },
          { label: t("profile") },
        ]}
        title={t("profile")}
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Name
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              Admin User
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Email
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              admin@ecommerce.vn
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Role
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              Super Admin
            </p>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Phone
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              0901234567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
