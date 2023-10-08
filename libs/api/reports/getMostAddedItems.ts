import { gaClient, propertyId } from '../../../firebase/gaClient';

export const getMostAddedItems = async (
  shopId: string,
  startDate: string,
  endDate: string
) => {
  const [itemsAnalyticsResponse] = await gaClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [
      {
        name: 'itemId',
      },
      {
        name: 'itemName',
      },
    ],
    metrics: [
      {
        name: 'itemViews',
      },
      {
        name: 'addToCarts',
      },
      {
        name: 'itemPurchaseQuantity',
      },
      {
        name: 'itemRevenue',
      },
    ],
    orderBys: [
      {
        metric: { metricName: 'addToCarts' },
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

  return itemsAnalyticsResponse;
};
