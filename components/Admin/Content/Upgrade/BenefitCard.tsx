import { IconType } from 'react-icons';

import { Box, Icon, Stack, Text } from '@chakra-ui/react';

const BenefitCard = ({
  iconType,
  text,
  icon,
}: {
  iconType?: IconType;
  text: string | JSX.Element;
  icon?: JSX.Element;
}) => {
  return (
    <Stack
      maxWidth="250px"
      direction={{ base: 'column', sm: 'row', md: 'column' }}
      spacing={{ base: '2', sm: '6', md: '2' }}
      alignItems="center"
    >
      {iconType ? (
        <Icon as={iconType} width="32px" height="32px" color="brand.green" />
      ) : icon ? (
        icon
      ) : null}

      <Box textAlign={{ base: 'center', sm: 'left', md: 'center' }}>
        {typeof text === 'string' ? (
          <Text fontFamily="source" fontSize="16px" fontWeight="normal">
            {text}
          </Text>
        ) : (
          text
        )}
      </Box>
    </Stack>
  );
};

export default BenefitCard;
