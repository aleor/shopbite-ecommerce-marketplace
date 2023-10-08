import { Box } from '@chakra-ui/react';

export const List = ({ children }) => {
  return (
    <Box mt={1} ml={4}>
      <ul>{children}</ul>
    </Box>
  );
};
