import { useContext, useState } from 'react';

import { Box, Divider, VStack } from '@chakra-ui/react';

import { ShopContext } from '../../hooks/shopContext';
import SpinnerOverlay from '../../SpinnerOverlay';
import BioLinks from './BioLink/BioLinks';
import ExternalLinks from './ExternalLinks/ExternalLinks';

const Links = () => {
  const shop = useContext(ShopContext);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <>
      <SpinnerOverlay visible={isSaving} message="Menyimpan perubahan..." />
      <Box
        px={{ base: '4', sm: '2', md: '4' }}
        py="4"
        width="100%"
        pointerEvents={isSaving ? 'none' : 'all'}
      >
        <VStack alignItems="flex-start" height="100%">
          <Box width="100%">
            <BioLinks
              shop={shop}
              onSaveStart={() => setIsSaving(true)}
              onSaveEnd={() => setIsSaving(false)}
            />
          </Box>

          <Divider borderColor="brand.green" />

          <Box flex="1" width="100%">
            <ExternalLinks
              shopId={shop.id}
              links={shop.links}
              onSaveStart={() => setIsSaving(true)}
              onSaveEnd={() => setIsSaving(false)}
            />
          </Box>
        </VStack>
      </Box>
    </>
  );
};

export default Links;
