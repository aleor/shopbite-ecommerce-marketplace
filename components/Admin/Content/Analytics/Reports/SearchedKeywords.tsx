import { Box, Heading, VStack } from '@chakra-ui/react';

import { CountableResult } from '../../../../../models/analytics';
import ReportTextRow from '../ReportTextRow';

const SearchedKeywords = ({
  searchResult,
}: {
  searchResult: CountableResult[];
}) => {
  return (
    <VStack spacing="3" flex="1" alignItems="flex-start" width="100%">
      <Heading
        as="h4"
        fontFamily="poppins"
        fontSize="20px"
        fontWeight="semibold"
      >
        Searched Keywords
      </Heading>

      {searchResult?.length ? (
        <Box w="100%">
          {searchResult.map((search, index) => (
            <Box key={index} pt="3" w="100%">
              <ReportTextRow label={search.value} value={search.count} />
            </Box>
          ))}
        </Box>
      ) : (
        <Box w="100%" pt="4" color="brand.black40">
          No data available for the selected timeframe
        </Box>
      )}
    </VStack>
  );
};

export default SearchedKeywords;
