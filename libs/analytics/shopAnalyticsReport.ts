import { GAReportModel } from '../../models/analytics';
import { mapToCountableResult } from './mapToCountableResult';

export type ShopAnalyticsReport = {
  catalogVisitsReport: GAReportModel;
  itemsViewedReport: GAReportModel;
  ordersCreatedReport: GAReportModel;
  purchaseRevenueReport: GAReportModel;
};

export type ShopAnalytics = {
  totalCatalogVisits: number;
  totalItemsViewed: number;
  totalOrdersCreated: number;
  averagePurchaseRevenue?: number;
  totalPurchaseRevenue: number;
};

export const reportToShopAnalytics = (
  report: ShopAnalyticsReport
): ShopAnalytics => {
  const totalPurchases = report.purchaseRevenueReport.rowCount;
  const totalRevenue =
    mapToCountableResult(report.purchaseRevenueReport?.totals)[0]?.count || 0;

  const averagePurchase = totalPurchases ? totalRevenue / totalPurchases : 0;

  return {
    totalCatalogVisits:
      mapToCountableResult(report.catalogVisitsReport?.totals)[0]?.count || 0,
    totalItemsViewed:
      mapToCountableResult(report.itemsViewedReport?.totals)[0]?.count || 0,
    totalOrdersCreated:
      mapToCountableResult(report.ordersCreatedReport?.totals)[0]?.count || 0,
    totalPurchaseRevenue: totalRevenue,
    averagePurchaseRevenue: averagePurchase,
  };
};

export const numberFormatter = (value: number) => {
  if (!value) {
    return '0';
  }

  if (value < 1000) {
    return `${value}`;
  } else if (value < 1000000) {
    return `${(value / 1000).toFixed(1)} ribu`;
  } else if (value < 1000000000) {
    return `${(value / 1000000).toFixed(1)} juta`;
  } else {
    return `${(value / 1000000000).toFixed(1)} miliar`;
  }
};

export const moneyValueFormatter = (value: number, currency: string) => {
  if (!value) {
    return '0';
  }

  let formattedAmount: string;

  if (value < 1000) {
    formattedAmount = `${value}`;
  } else if (value < 1000000) {
    formattedAmount = `${(value / 1000).toFixed(1)} ribu`;
  } else if (value < 1000000000) {
    formattedAmount = `${(value / 1000000).toFixed(1)} juta`;
  } else {
    formattedAmount = `${(value / 1000000000).toFixed(1)} miliar`;
  }

  return `${currency} ${formattedAmount}`;
};
