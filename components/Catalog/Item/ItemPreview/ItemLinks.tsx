import { Button, HStack, Text, VStack } from '@chakra-ui/react';

import { ItemLink } from '../../../../models';
import { LinkType } from '../../../../models/linkType';
import {
    GoFoodColoredSvg, GrabFoodColoredSvg, LazadaColoredSvg, ShopeeColoredSvg, ShopeeFoodColoredSvg,
    TokopediaColoredSvg, TravelokaEatsColoredSvg
} from '../../../Icons/ItemLinks';

const ItemLinks = ({ links }: { links: ItemLink[] }) => {
  if (!links?.length) {
    return null;
  }

  const getIconSvg = (linkType: LinkType, size?: { w: string; h: string }) => {
    const props = size || { w: '24px', h: '24px' };

    switch (linkType) {
      case LinkType.Lazada:
        return <LazadaColoredSvg {...props} />;
      case LinkType.Shopee:
        return <ShopeeColoredSvg {...props} />;
      case LinkType.GrabFood:
        return <GrabFoodColoredSvg {...props} />;
      case LinkType.GoFood:
        return <GoFoodColoredSvg {...props} />;
      case LinkType.TravelokaEats:
        return <TravelokaEatsColoredSvg {...props} />;
      case LinkType.ShopeeFood:
        return <ShopeeFoodColoredSvg {...props} />;
      case LinkType.Tokopedia:
        return <TokopediaColoredSvg {...props} />;
      default:
        return null;
    }
  };

  return (
    <VStack py="2" spacing="2" alignItems="flex-start">
      <Text fontFamily="poppins" fontWeight="medium" fontSize="12px">
        Juga tersedia melalui
      </Text>
      <HStack h="32px" spacing={4}>
        {links.map((link) => (
          <Button
            key={link.type}
            as="a"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            borderRadius="4px"
            h="100%"
            variant="link"
            bgColor="#EDF2F7"
            minHeight="32px"
            minWidth="32px"
          >
            {getIconSvg(link.type)}
          </Button>
        ))}
      </HStack>
    </VStack>
  );
};

export default ItemLinks;