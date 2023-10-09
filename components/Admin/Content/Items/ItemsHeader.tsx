import { Box, Button, Heading, HStack } from '@chakra-ui/react';

const ItemsHeader = ({
  onSaveChanges,
  onAddNewItem,
}: {
  onSaveChanges: () => void;
  onAddNewItem: () => void;
}) => {
  return (
    <Box>
      <HStack
        width="100%"
        justifyContent={{
          base: 'space-around',
          sm: 'space-between',
          lg: 'left',
        }}
        spacing="8"
      >
        <HStack
          spacing={{ base: '4', sm: '2', lg: '4' }}
          width="100%"
          justifyContent={{
            base: 'space-around',
            sm: 'space-between',
            lg: 'left',
          }}
          pb="2"
        >
          <HStack>
            <Heading
              as="h4"
              fontFamily="poppins"
              fontWeight="semibold"
              fontSize="24px"
            >
              Products
            </Heading>
          </HStack>
        </HStack>
        <HStack spacing="4">
          <Button
            fontFamily="poppins"
            minWidth="200px"
            size="md"
            onClick={onAddNewItem}
          >
            Add new product
          </Button>
        </HStack>
      </HStack>
    </Box>
  );
};

export default ItemsHeader;
