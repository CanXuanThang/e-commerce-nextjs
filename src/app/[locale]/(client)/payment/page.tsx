import { getTranslations } from "next-intl/server";
import OrderInfo from "./_component/OrderInfo";
import CartInfo from "./_component/CartInfo";

export default async function PaymentPage() {
  const t = await getTranslations("Order");
  return (
    <section className="container mx-auto grid grid-cols-1 gap-6 px-4 py-5 sm:px-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)] lg:items-start lg:gap-10">
      <div className="min-w-0">
        <h1 className="text-md md:text-xl font-bold mb-3">{t("orderInfo")}</h1>

        <OrderInfo />
      </div>

      <div className="min-w-0">
        <h1 className="mb-3 text-md md:text-xl  font-bold">{t("cartItem")}</h1>
        <CartInfo />
      </div>
    </section>
  );
}
