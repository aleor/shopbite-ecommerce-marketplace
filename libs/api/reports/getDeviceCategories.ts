import { gaClient, propertyId } from '../../../firebase/gaClient';

export const getDeviceCategories = async (
  shopId: string,
  startDate: string,
  endDate: string
) => {
  const [deviceCategoryResponse] = await gaClient.runReport({
    property: `properties/${propertyId}`,
    dateRanges: [
      {
        startDate,
        endDate,
      },
    ],
    dimensions: [
      {
        name: 'deviceCategory',
      },
    ],
    metrics: [
      {
        name: 'activeUsers',
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
  });

  return deviceCategoryResponse;
};
