import { Box, Heading, VStack } from '@chakra-ui/react';

import { CountableResult } from '../../../../../models/analytics';
import ReportTextRow from '../ReportTextRow';

const ViewedCategories = ({
  collectionResult,
}: {
  collectionResult: CountableResult[];
}) => {
  return (
    <VStack spacing="3" alignItems="flex-start" flex="1" w="100%">
      <Heading
        as="h4"
        fontFamily="poppins"
        fontSize="20px"
        fontWeight="semibold"
      >
        Koleksi Produk Dipilih
      </Heading>

      {collectionResult?.length ? (
        <Box w="100%">
          {collectionResult.map((collection, index) => (
            <Box key={index} pt="3" w="100%">
              <ReportTextRow
                label={collection.value}
                value={collection.count}
              />
            </Box>
          ))}
        </Box>
      ) : (
        <Box w="100%" pt="4" color="brand.black40">
          Tidak ada data tersedia untuk kurun waktu yang dipilih
        </Box>
      )}
    </VStack>
  );
};

export default ViewedCategories;
