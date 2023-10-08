import { gaClient, propertyId } from '../../../firebase/gaClient';

export const getCollectionsViewed = async (
  shopId: string,
  startDate: string,
  endDate: string
) => {
  const [topCollectionsResponse] = await gaClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [
      {
        name: 'itemListName',
      },
    ],
    metrics: [
      {
        name: 'itemListViews',
      },
    ],
    orderBys: [
      {
        metric: { metricName: 'itemListViews' },
        desc: true,
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
    limit: 10,
  });

  return topCollectionsResponse;
};
