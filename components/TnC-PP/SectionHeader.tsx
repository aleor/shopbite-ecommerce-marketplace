import { AccordionButton, AccordionIcon, Box } from '@chakra-ui/react';

export const SectionHeader = ({ children }) => {
  return (
    <>
      <AccordionButton px={0}>
        <AccordionIcon />
        <Box flex="1" textAlign="left" ml="1" fontSize="lg" fontWeight="600">
          {children}
        </Box>
      </AccordionButton>
    </>
  );
};
