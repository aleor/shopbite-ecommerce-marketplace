import { gaClient, propertyId } from '../../../firebase/gaClient';

const TOP_LINKS_LIMIT = 5;

export const getMostVisitedLinks = async (
  shopId: string,
  startDate: string,
  endDate: string
) => {
  const [topVisitedLinksResponse] = await gaClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [
      {
        name: 'customEvent:url',
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
                value: 'click_link',
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
          {
            notExpression: {
              filter: {
                fieldName: 'customEvent:url',
                stringFilter: {
                  matchType: 'EXACT',
                  value: '(not set)',
                },
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
    limit: TOP_LINKS_LIMIT,
  });

  return topVisitedLinksResponse;
};
