import { HStack, Text } from '@chakra-ui/react';

const ReportTextRow = ({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) => {
  return (
    <HStack w="100%" justifyContent="space-between" alignItems="flex-start">
      <Text fontFamily="source" fontSize="16px" fontWeight="normal">
        {label}
      </Text>
      <Text fontFamily="source" fontSize="16px" fontWeight="semibold">
        {value}
      </Text>
    </HStack>
  );
};

export default ReportTextRow;
