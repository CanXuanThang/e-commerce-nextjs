import { getTranslations } from "next-intl/server";

export const dynamic = "force-static";

export default async function Footer() {
  const t = await getTranslations("Footer");

  return (
    <footer className="bg-black text-white pt-10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top section */}
        <div className="grid md:grid-cols-3 gap-8 border-b border-gray-700 pb-8">
          {/* Company info */}
          <div>
            <h3 className="font-semibold mb-3">{t("company")}</h3>

            <p className="text-sm leading-6">{t("address")}</p>

            <p className="mt-2 text-sm">{t("phone")}</p>

            <button className="mt-4 bg-gray-300 text-black px-4 py-2 text-sm">
              {t("contact")}
            </button>
          </div>

          {/* Hotline */}
          <div>
            <p className="mb-2 font-semibold">{t("order")}</p>

            <a href="tel:0912345678" className="text-lg font-bold">
              0912345678
            </a>

            <p className="mt-4 font-semibold">{t("support")}</p>

            <a href="tel:0961010203" className="text-lg font-bold">
              0961010203
            </a>
          </div>

          {/* Social */}
          <div>
            <h3 className="mb-3 font-semibold">{t("connect")}</h3>

            <div className="flex gap-4">
              <div className="border p-3">FB</div>
              <div className="border p-3">Zalo</div>
              <div className="border p-3">TikTok</div>
              <div className="border p-3">Shopee</div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="grid md:grid-cols-4 gap-8 py-10">
          <div>
            <h4 className="font-semibold mb-3">{t("krik")}</h4>

            <ul className="space-y-2 text-sm">
              <li>{t("contactLink")}</li>
              <li>{t("exclusive")}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t("policy")}</h4>

            <ul className="space-y-2 text-sm">
              <li>{t("memberPolicy")}</li>
              <li>{t("shippingPolicy")}</li>
              <li>{t("returnPolicy")}</li>
              <li>{t("complaintPolicy")}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t("fashionKnowledge")}</h4>

            <ul className="space-y-2 text-sm">
              <li>Blog</li>
              <li>{t("news")}</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{t("about")}</h4>

            <ul className="space-y-2 text-sm">
              <li>{t("storeSystem")}</li>
              <li>{t("recruitment")}</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
