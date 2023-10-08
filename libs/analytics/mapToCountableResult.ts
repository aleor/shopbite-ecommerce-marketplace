import { AnalyticsProps } from '../../models/analytics';
import { CountableResult } from '../../models/analytics/countableResult';

export const mapToCountableResult = (
  data: AnalyticsProps[]
): CountableResult[] => {
  if (!data || data.every((r) => !r.dimensionValues?.length)) return [];

  let dataArray: CountableResult[] = [];

  try {
    const dimensions = data.map((row) => row.dimensionValues[0].value);
    const metrics = data.map((row) => row.metricValues[0].value);

    dataArray = dimensions.map((dimension, index) => {
      return {
        value: dimension,
        count: +metrics[index],
      };
    });
  } catch (error) {
    console.log(error);
  }

  return dataArray;
};
