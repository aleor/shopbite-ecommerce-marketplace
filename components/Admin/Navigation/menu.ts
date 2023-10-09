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
    groupName: 'Shop Settings',
    items: [
      { label: 'Products', query: 'items' },
      { label: 'Collections', query: 'collections' },
      { label: 'Links', query: 'links' },
    ],
  },
  {
    groupName: 'Management',
    items: [
      { label: 'Orders', query: 'orders' },
      { label: 'Analytics', query: 'analytics' },
      { label: 'Upgrade', query: 'upgrade' },
      { label: 'Account Settings', query: 'account' },
    ],
  },
];
