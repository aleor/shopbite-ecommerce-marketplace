import { eachDayOfInterval, format } from 'date-fns';

import { GAReportModel } from '../../models/analytics';
import { mapToCountableResult } from './mapToCountableResult';

const getNormalizedDataset = (
  reports: GAReportModel[],
  dateRange: string[]
) => {
  const normalizedDatasets = reports.map((report) => {
    const countableData = mapToCountableResult(report.rows);

    const normalizedData = dateRange.map((date) => {
      const metricData = countableData.find((data) => data.value === date);

      return {
        date,
        value: metricData ? Math.round(metricData.count) : 0,
      };
    });

    return normalizedData;
  });

  return normalizedDatasets;
};

/**
 * GA reports are missing data for some days. This function will fill in the missing data by adding 0 values.
 * This is useful for charts that don't support / partially support gaps in the data.
 */
export const normalizeReportsByDates = (
  reports: GAReportModel[],
  startDate: Date | number,
  endDate: Date | number
) => {
  const gaDateFormat = 'yyyyMMdd';

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const formattedDays = days.map((day) => format(day, gaDateFormat));

  const normalizedReport = getNormalizedDataset(reports, formattedDays);

  return normalizedReport;
};
