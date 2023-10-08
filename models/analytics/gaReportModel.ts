import { AnalyticsProps } from './analyticProps';

export interface DimensionHeader {
  name: string;
}

export interface MetricHeader {
  name: string;
  type: 'TYPE_INTEGER' | 'TYPE_CURRENCY';
}

export interface GAReportModel {
  dimensionHeaders: DimensionHeader[];
  metricHeaders: MetricHeader[];
  rows: AnalyticsProps[];
  rowCount: number;
  totals: AnalyticsProps[];
}

export interface GABatchReportModel {
  reports: GAReportModel[];
}
