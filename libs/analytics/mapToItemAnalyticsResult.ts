import { GAReportModel, ItemAnalyticsDimension, ItemAnalyticsMetric } from '../../models/analytics';
import { ItemAnalyticsResult } from '../../models/analytics/itemAnalyticsResult';

export const mapToItemAnalyticsResult = (
  report: GAReportModel
): ItemAnalyticsResult[] => {
  if (!report) return null;

  let results: ItemAnalyticsResult[] = [];

  const getDimensionValueIndex = (dimension: ItemAnalyticsDimension) => {
    return report.dimensionHeaders.findIndex(
      (header) => header.name === dimension
    );
  };

  const getMetricValueIndex = (metric: ItemAnalyticsMetric) => {
    return report.metricHeaders.findIndex((header) => header.name === metric);
  };

  try {
    results = report.rows.map((row) => {
      return {
        itemId:
          row.dimensionValues[
            getDimensionValueIndex(ItemAnalyticsDimension.ItemId)
          ]?.value,
        itemName:
          row.dimensionValues[
            getDimensionValueIndex(ItemAnalyticsDimension.ItemName)
          ]?.value,
        viewCount:
          +row.metricValues[getMetricValueIndex(ItemAnalyticsMetric.ViewCount)]
            ?.value,
        addToCartCount:
          +row.metricValues[
            getMetricValueIndex(ItemAnalyticsMetric.AddToCartCount)
          ]?.value,
        itemRevenue:
          +row.metricValues[
            getMetricValueIndex(ItemAnalyticsMetric.ItemRevenue)
          ]?.value,
        purchasedItemsCount:
          +row.metricValues[
            getMetricValueIndex(ItemAnalyticsMetric.PurchasedItemsCount)
          ]?.value,
      };
    });
  } catch (e) {
    console.log(e);
  }

  return results;
};
