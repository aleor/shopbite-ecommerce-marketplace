import { google } from '@google-analytics/data/build/protos/protos';

import { gaClient, propertyId } from '../../../firebase/gaClient';

export const getPurchaseRevenue = async (
  shopId: string,
  startDate: string,
  endDate: string
) => {
  const [purchaseRevenueResponse] = await gaClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [
      {
        name: 'date',
      },
    ],
    metrics: [
      {
        name: 'purchaseRevenue',
      },
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'customEvent:shop_id',
        stringFilter: {
          matchType: 'EXACT',
          value: shopId,
        },
      },
    },
    orderBys: [
      {
        dimension: { dimensionName: 'date' },
        desc: false,
      },
    ],
    metricAggregations: [google.analytics.data.v1beta.MetricAggregation.TOTAL],
  });

  return purchaseRevenueResponse;
};
