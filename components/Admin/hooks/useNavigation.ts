import { useRouter } from 'next/router';

import { MenuTabQuery } from '../Navigation/menu';

export const useNavigation = () => {
  const router = useRouter();

  const getLink = (query: MenuTabQuery) => {
    const link = `/admin?tab=${query}`;

    return link;
  };

  const navigateTo = (query: MenuTabQuery) => {
    const link = getLink(query);

    router.push(link);
  };

  return { getLink, navigateTo };
};
