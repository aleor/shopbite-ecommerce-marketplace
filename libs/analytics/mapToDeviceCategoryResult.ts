import {
  AnalyticsProps,
  DeviceCategory,
  DeviceCategoryResult,
} from '../../models/analytics';

export const mapToDeviceCategoryResult = (
  data: AnalyticsProps[]
): DeviceCategoryResult[] => {
  if (!data) return [];

  let dataArray: DeviceCategoryResult[] = [];

  try {
    const deviceCategories: DeviceCategory[] = ['desktop', 'mobile', 'tablet'];

    deviceCategories.map((category) => {
      const row = data.find(
        (row) => row.dimensionValues?.[0].value === category
      );

      dataArray.push({
        category,
        count: row ? +row.metricValues[0].value : 0,
      });
    });
  } catch (error) {
    console.log(error);
  }

  return dataArray;
};
