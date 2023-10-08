export type MenuTabQuery =
  | 'collections'
  | 'items'
  | 'links'
  | 'analytics'
  | 'upgrade'
  | 'account'
  | 'orders';

export type NavMenu = {
  groupName: string;
  items: { label: string; query: MenuTabQuery }[];
}[];

export const menu: NavMenu = [
  {
    groupName: 'Etalase',
    items: [
      { label: 'Produk', query: 'items' },
      { label: 'Koleksi', query: 'collections' },
      { label: 'Link', query: 'links' },
    ],
  },
  {
    groupName: 'Pengelolaan',
    items: [
      { label: 'Daftar Pesanan', query: 'orders' },
      { label: 'Analitik', query: 'analytics' },
      { label: 'Upgrade', query: 'upgrade' },
      { label: 'Pengaturan Akun', query: 'account' },
    ],
  },
];
