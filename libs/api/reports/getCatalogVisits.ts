import { google } from '@google-analytics/data/build/protos/protos';

import { gaClient, propertyId } from '../../../firebase/gaClient';

export const getCatalogVisits = async (
  shopId: string,
  startDate: string,
  endDate: string
) => {
  const [catalogVisitsResponse] = await gaClient.runReport({
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
        name: 'eventCount',
      },
    ],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: 'eventName',
              stringFilter: {
                matchType: 'EXACT',
                value: 'view_catalog',
              },
            },
          },
          {
            filter: {
              fieldName: 'customEvent:shop_id',
              stringFilter: {
                matchType: 'EXACT',
                value: shopId,
              },
            },
          },
        ],
      },
    },
    orderBys: [
      {
        dimension: { dimensionName: 'date' },
        desc: false,
      },
    ],
    keepEmptyRows: true,
    metricAggregations: [google.analytics.data.v1beta.MetricAggregation.TOTAL],
  });

  return catalogVisitsResponse;
};
