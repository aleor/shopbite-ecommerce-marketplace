import { Box, Text, VStack } from '@chakra-ui/react';

const AnalyticsCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <Box
      p="24px"
      borderRadius="12px"
      boxShadow="0px 4px 20px rgba(0, 0, 0, 0.04)"
    >
      <VStack spacing="3">
        <Text
          fontFamily="poppins"
          fontSize={{ base: '16px', sm: '12px', md: '16px' }}
          noOfLines={1}
        >
          {title}
        </Text>
        <Text
          fontFamily="source"
          fontSize={{ base: '26px', sm: '20px', md: '26px' }}
          fontWeight="semibold"
          color="brand.blue"
        >
          {value || 'N/A'}
        </Text>
      </VStack>
    </Box>
  );
};

export default AnalyticsCard;
