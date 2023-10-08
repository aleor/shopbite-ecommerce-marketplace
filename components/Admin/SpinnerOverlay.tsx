import { Box, CircularProgress, HStack, Text } from '@chakra-ui/react';

const SpinnerOverlay = ({
  visible,
  message = 'Menyimpan perubahan...',
}: {
  visible: boolean;
  message?: string;
}) => {
  if (!visible) {
    return null;
  }

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      bg="rgba(0, 0, 0, 0.4)"
      overflow="hidden"
      opacity={0.9}
      pointerEvents="none"
      zIndex={9999}
    >
      <HStack height="100vh" spacing="4" justifyContent="center">
        <CircularProgress isIndeterminate color="brand.blue" />

        <Text color="whiteAlpha.700" fontFamily="poppins">
          {message}
        </Text>
      </HStack>
    </Box>
  );
};

export default SpinnerOverlay;
