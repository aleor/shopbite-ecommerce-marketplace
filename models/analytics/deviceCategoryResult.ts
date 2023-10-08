export type DeviceCategory = 'desktop' | 'mobile' | 'tablet';

export interface DeviceCategoryResult {
  category: DeviceCategory;
  count: number;
}
