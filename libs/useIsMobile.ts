import { useMediaQuery } from '@chakra-ui/react';

export const useIsMobile = () => {
  const [isMobile] = useMediaQuery('(max-width: 760px)');
  return isMobile;
};
