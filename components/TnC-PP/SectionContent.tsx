import { AccordionPanel, Box } from '@chakra-ui/react';

export const SectionContent = ({ children }) => {
  return (
    <AccordionPanel pb={2} pt={1}>
      <Box
        flex="1"
        textAlign="left"
        ml="2"
        fontSize={{ base: 'md', md: 'md', lg: 'lg' }}
        fontWeight="normal"
        fontFamily="source"
      >
        {children}
      </Box>
    </AccordionPanel>
  );
};
