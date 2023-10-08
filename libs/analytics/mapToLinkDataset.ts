import { GAReportModel } from '../../models/analytics';
import { normalizeReportsByDates } from './normalizeReportByDates';

export const mapToLinksDataset = (
  linksAnalyticsReport: GAReportModel,
  dateRange: Date[]
) => {
  const [dateIndex, labelIndex, urlIndex, typeIndex] = [
    'date',
    'customEvent:label',
    'customEvent:url',
    'customEvent:type',
  ].map((header) =>
    linksAnalyticsReport.dimensionHeaders.findIndex((h) => h.name === header)
  );

  const link = {
    label: linksAnalyticsReport.rows[0]?.dimensionValues[labelIndex]?.value,
    url: linksAnalyticsReport.rows[0]?.dimensionValues[urlIndex]?.value,
    type: linksAnalyticsReport.rows[0]?.dimensionValues[typeIndex]?.value,
  };

  const [normalizedLinkReport] = normalizeReportsByDates(
    [linksAnalyticsReport],
    dateRange[0],
    dateRange[1]
  );

  const dataset = {
    link,
    data: normalizedLinkReport,
  };

  return dataset;
};
