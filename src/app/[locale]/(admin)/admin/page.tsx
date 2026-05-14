"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllOrders } from "@/apis/order";
import { useTranslations } from "next-intl";
import AdminBreadcrumb from "@/component/Admin/AdminBreadcrumb";
import DashboardDateFilter from "./_components/DashboardDateFilter";
import {
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  subMonths,
  subDays,
} from "date-fns";
import DashboardStats from "./_components/DashboardStats";
import DashboardCharts from "./_components/DashboardCharts";
import { getTopSellingProducts } from "@/apis/product";

export default function AdminDashboard() {
  const t = useTranslations("Admin");
  const [period, setPeriod] = useState<"day" | "week" | "month">("month");

  const dateRange = useMemo(() => {
    const end = new Date();
    if (period === "day") {
      return { start: subDays(end, 1), end };
    }
    if (period === "week") {
      return { start: subDays(end, 7), end };
    }
    return { start: subMonths(end, 1), end };
  }, [period]);

  const { data: ordersData } = useQuery({
    queryKey: ["orders"],
    queryFn: getAllOrders,
  });

  const { data: productsData } = useQuery({
    queryKey: ["get-top-selling-product"],
    queryFn: () => getTopSellingProducts(),
  });

  const orders = useMemo(() => ordersData?.data || [], [ordersData]);
  const products = useMemo(() => productsData?.data || [], [productsData]);

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= dateRange.start && orderDate <= dateRange.end;
    });
  }, [orders, dateRange]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalRevenue = filteredOrders
      .filter((order) => order.status === "completed")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const totalOrders = filteredOrders.length;

    const totalProductsSold = filteredOrders
      .filter((order) => order.status === "completed")
      .reduce((sum, order) => sum + order.totalQuantity, 0);

    return { totalRevenue, totalOrders, totalProductsSold };
  }, [filteredOrders]);

  // Top 5 products
  const topProducts = useMemo(() => {
    const productSales = new Map<
      string,
      { quantity: number; revenue: number }
    >();

    products.forEach((prod) => {
      const existing = productSales.get(prod.name) || {
        quantity: 0,
        revenue: 0,
      };
      productSales.set(prod.name, {
        quantity: existing.quantity + prod.totalSold,
        revenue: existing.revenue + prod.totalAmount,
      });
    });

    console.log(productSales);

    return Array.from(productSales.entries())
      .sort((a, b) => b[1].quantity - a[1].quantity)
      .slice(0, 5)
      .map(([name, data]) => ({
        name,
        quantity: data.quantity,
        revenue: data.revenue,
      }));
  }, [products]);

  // Monthly revenue
  const monthlyRevenue = useMemo(() => {
    const months = eachMonthOfInterval({
      start: dateRange.start,
      end: dateRange.end,
    });
    return months.map((month) => {
      const monthOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate >= startOfMonth(month) &&
          orderDate <= endOfMonth(month) &&
          order.status === "completed"
        );
      });
      const revenue = monthOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0,
      );
      return {
        monthDate: month.toISOString(),
        revenue,
      };
    });
  }, [filteredOrders, dateRange]);

  return (
    <div className="space-y-6">
      <AdminBreadcrumb
        items={[
          { label: t("breadcrumb.home"), href: "/admin/users" },
          { label: t("dashboard.title") },
        ]}
        title={t("dashboard.title")}
        action={
          <DashboardDateFilter
            selectedPeriod={period}
            onPeriodChange={setPeriod}
          />
        }
      />

      <DashboardStats
        stats={stats}
        labels={{
          revenue: t("dashboard.totalRevenue"),
          orders: t("dashboard.totalOrders"),
          products: t("dashboard.totalProductsSold"),
        }}
        currency={t("dashboard.currency")}
      />

      <DashboardCharts
        topProducts={topProducts}
        monthlyRevenue={monthlyRevenue}
        labels={{
          topProducts: t("dashboard.topProducts"),
          monthlyRevenue: t("dashboard.monthlyRevenue"),
        }}
        currency={t("dashboard.currency")}
        productsUnit={t("dashboard.productsUnit")}
      />
    </div>
  );
}
