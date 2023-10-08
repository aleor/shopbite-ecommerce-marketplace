import { useState } from 'react';
import { HiOutlineInformationCircle } from 'react-icons/hi';

import { IconButton, Tooltip } from '@chakra-ui/react';

const InfoButtonWithTooltip = ({ label }) => {
  const [isTooltipShown, setIsTooltipShown] = useState(false);

  return (
    <Tooltip
      label={label}
      bg="gray.600"
      color="white"
      hasArrow
      fontWeight="normal"
      borderRadius="8px"
      fontFamily="poppins"
      fontSize="12px"
      p="2"
      textAlign="center"
      maxWidth="250px"
      isOpen={isTooltipShown}
    >
      <IconButton
        icon={<HiOutlineInformationCircle size="20px" />}
        aria-label={'information'}
        variant="ghost"
        color="brand.green"
        size="xs"
        _focus={{ outline: 'none' }}
        _hover={{ cursor: 'pointer' }}
        onMouseEnter={() => setIsTooltipShown(true)}
        onMouseLeave={() => setIsTooltipShown(false)}
        onClick={() => setIsTooltipShown(true)}
      />
    </Tooltip>
  );
};

export default InfoButtonWithTooltip;
