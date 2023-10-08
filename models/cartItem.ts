import { CustomizedItem } from './customizedItem';

export type CartItem = CustomizedItem & { note?: string | null };
