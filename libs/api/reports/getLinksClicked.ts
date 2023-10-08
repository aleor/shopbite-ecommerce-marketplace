import { google } from '@google-analytics/data/build/protos/protos';

import { gaClient, propertyId } from '../../../firebase/gaClient';
import { getMostVisitedLinks } from './getMostVisitedLinks';

export const getLinksClicked = async (
  shopId: string,
  startDate: string,
  endDate: string
) => {
  const top5linksReport = await getMostVisitedLinks(shopId, startDate, endDate);

  const topLinkUrls = top5linksReport.rows
    .map((row) => {
      return row.dimensionValues[0].value;
    })
    .filter((url) => url);

  if (!topLinkUrls.length) {
    return [];
  }

  const reportRequests = topLinkUrls.map((url) => {
    return {
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
        {
          name: 'customEvent:label',
        },
        {
          name: 'customEvent:url',
        },
        {
          name: 'customEvent:type',
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
                fieldName: 'customEvent:url',
                stringFilter: {
                  matchType: 'EXACT',
                  value: url,
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
    } as google.analytics.data.v1beta.IBatchRunReportsRequest;
  });

  const [linksAnalyticsResponse] = await gaClient.batchRunReports({
    property: `properties/${propertyId}`,
    requests: reportRequests,
  });

  return linksAnalyticsResponse;
};
