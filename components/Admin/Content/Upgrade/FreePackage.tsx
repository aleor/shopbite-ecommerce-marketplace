import { BsClipboardData, BsGlobe, BsSignpost, BsWifi } from 'react-icons/bs';

import {
  Box,
  Button,
  Stack,
  VStack,
} from '@chakra-ui/react';

import BenefitCard from './BenefitCard';
import UpgradePageHeader from './UpgradePageHeader';

const FreePackage = ({ onClose }: { onClose: () => void }) => {
  return (
    <VStack width="100%" alignItems="flex-start" spacing="4">
      <UpgradePageHeader mode="view_free_package" onClose={onClose} canGoBack />
      <Box width="100%" pt="8">
        <VStack spacing={{ base: '20', sm: '12', md: '20' }}>
          <Stack
            spacing={{ base: '20', sm: '12', md: '20' }}
            alignItems="flex-start"
            direction={{ base: 'row', sm: 'column', md: 'row' }}
          >
            <BenefitCard
              iconType={BsWifi}
              text="Website dan sistem pengelolaan toko gratis hingga 30 jenis produk"
            />
            <BenefitCard
              iconType={BsSignpost}
              text="Menghubungkan pelanggan Anda langsung kepada kontak admin toko Anda ketika melakukan pemesanan"
            />
          </Stack>
          <Stack
            spacing={{ base: '20', sm: '12', md: '20' }}
            alignItems="flex-start"
            direction={{ base: 'row', sm: 'column', md: 'row' }}
          >
            <BenefitCard
              iconType={BsGlobe}
              text="Tautan untuk link sosial media, e-commerce, delivery makanan online, dan link lainnya"
            />
            <BenefitCard
              iconType={BsClipboardData}
              text="Data analitik dari website dan perilaku pembeli hingga 7 hari kebelakang"
            />
          </Stack>
        </VStack>
      </Box>

      <VStack spacing="8" py="12" width="100%" alignItems="center">
        <Button width="328px" onClick={onClose}>
          Lihat manfaat dari Akun Premium
        </Button>
      </VStack>
    </VStack>
  );
};

export default FreePackage;
