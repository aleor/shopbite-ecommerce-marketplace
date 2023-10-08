export type OrderItem = {
  id: string;
  title: string;
  imageUrl?: string | null;
  note?: string | null;
  price: number;
  quantity: number;
  variant?: string | null;
  addOns?: string | null;
};