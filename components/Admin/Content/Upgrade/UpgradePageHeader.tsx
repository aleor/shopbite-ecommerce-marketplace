import { useCallback } from 'react';
import { HiOutlineArrowLeft } from 'react-icons/hi';

import { Box, Heading, HStack, IconButton, Text, useBreakpointValue } from '@chakra-ui/react';

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
        return 'Boost Your Sales';
      case 'view_free_package':
        return 'Benefits You Have';
      case 'select_plan':
        return 'Choose the Premium Package Purchase Duration';
      default:
        return '';
    }
  }, [mode]);

  const renderText = useCallback(() => {
    switch (mode) {
      case 'view_all_benefits':
        return 'Get more benefits and maximize your sales with the Premium Account features from Shopbite';
      case 'view_free_package':
        return `Enjoy the benefits of Shopbite's key features free forever`;
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
            aria-label="Back"
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
