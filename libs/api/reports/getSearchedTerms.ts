import { gaClient, propertyId } from '../../../firebase/gaClient';

export const getSearchedTerms = async (
  shopId: string,
  startDate: string,
  endDate: string
) => {
  const [searchTermsResponse] = await gaClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [
      {
        name: 'searchTerm',
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
                value: 'search',
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
        metric: { metricName: 'eventCount' },
        desc: true,
      },
    ],
    limit: 10,
  });

  return searchTermsResponse;
};
