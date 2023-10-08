import { useCallback } from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi';

import {
  Box,
  Heading,
  HStack,
  IconButton,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';

import { UpgradeTabMode } from './Upgrade';

const UpgradePageHeader = ({
  mode,
  onClose,
  canGoBack,
}: {
  mode: UpgradeTabMode;
  onClose?: () => void;
  canGoBack?: boolean;
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  const renderTitle = useCallback(() => {
    switch (mode) {
      case 'view_all_benefits':
        return 'Tingkatkan Penjualan Anda';
      case 'view_free_package':
        return 'Manfaat yang Anda Miliki';
      case 'select_plan':
        return 'Pilih Durasi Pembelian Paket Premium';
      default:
        return '';
    }
  }, [mode]);

  const renderText = useCallback(() => {
    switch (mode) {
      case 'view_all_benefits':
        return 'Dapatkan manfaat lebih dan maksimalkan penjualan Anda dengan fitur Akun Premium dari Shopbite';
      case 'view_free_package':
        return 'Nikmati manfaat dari fitur utama Shopbite gratis hingga selamanya';
      default:
        return '';
    }
  }, [mode]);

  return (
    <>
      <HStack justifyContent="space-between" pb="2">
        {canGoBack && (
          <IconButton
            icon={<HiOutlineArrowLeft size={isMobile ? '14px' : '18px'} />}
            onClick={onClose}
            aria-label="Kembali"
            variant="ghost"
            color="brand.green"
            size={isMobile ? 'xs' : 'md'}
          />
        )}
        <Heading
          as="h4"
          fontFamily="poppins"
          fontWeight="semibold"
          fontSize={{ base: '24px', sm: '16px', md: '24px' }}
        >
          {renderTitle()}
        </Heading>
      </HStack>
      <Box>
        <Text fontFamily="poppins" fontSize="16px">
          {renderText()}
        </Text>
      </Box>
    </>
  );
};

export default UpgradePageHeader;
