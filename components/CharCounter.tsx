import { Text, TextProps } from '@chakra-ui/react';

const CharCounter = ({
  value,
  maxLength = 60,
  textProps,
}: {
  value: string;
  maxLength?: number;
  textProps?: TextProps;
}) => {
  return (
    <Text fontWeight="normal" color="brand.gray" fontSize="10px" {...textProps}>
      {value?.length} / {maxLength}
    </Text>
  );
};

export default CharCounter;
