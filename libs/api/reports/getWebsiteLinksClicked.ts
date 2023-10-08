import { gaClient, propertyId } from '../../../firebase/gaClient';

export const getWebsiteLinksClicked = async (
  shopId: string,
  startDate: string,
  endDate: string
) => {
  const [websiteLinksAnalyticsResponse] = await gaClient.runReport({
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
              fieldName: 'customEvent:type',
              stringFilter: {
                matchType: 'EXACT',
                value: 'SO_Web',
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
        dimension: {
          dimensionName: 'date',
        },
        desc: false,
      },
    ],
  });

  return websiteLinksAnalyticsResponse;
};
