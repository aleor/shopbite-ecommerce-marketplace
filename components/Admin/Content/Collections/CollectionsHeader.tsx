import { Box, Button, Heading, HStack, Text, useBreakpointValue } from '@chakra-ui/react';

const CollectionsHeader = ({
  mode = 'view',
  collectionsCount,
  onManage,
  onSave,
  onCancel,
  onAddNewCollection,
}: {
  mode: 'view' | 'edit';
  collectionsCount: number;
  onManage?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  onAddNewCollection?: () => void;
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });

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
        pb="2"
      >
        <HStack
          spacing={{ base: '4', sm: '2', lg: '4' }}
          width="100%"
          justifyContent={{
            base: 'space-around',
            sm: 'space-between',
            lg: 'left',
          }}
        >
          <HStack>
            <Heading as="h4" fontFamily="poppins" fontWeight="semibold">
              <HStack>
                <Text fontSize={{ base: '24px', sm: '16px', md: '24px' }}>
                  Collections
                </Text>{' '}
                <Text
                  color="brand.black40"
                  fontWeight="normal"
                  fontSize={{ base: '16px', sm: '12px', md: '16px' }}
                >
                  ({collectionsCount})
                </Text>
              </HStack>
            </Heading>
          </HStack>
        </HStack>
        {mode === 'view' && (
          <HStack spacing="4">
            <Button
              variant={isMobile ? 'link' : 'outline'}
              color="brand.green"
              borderColor="brand.green"
              minWidth={isMobile ? 'auto' : '200px'}
              fontFamily="poppins"
              fontWeight={isMobile ? 'normal' : 'semibold'}
              _focus={{ outline: 'none' }}
              size="md"
              onClick={() => onManage?.()}
            >
              Manage collections
            </Button>
            <Button
              fontFamily="poppins"
              minWidth="200px"
              size="md"
              onClick={() => onAddNewCollection?.()}
              display={{ base: 'flex', sm: 'none', lg: 'flex' }}
            >
              Add a new collection
            </Button>
          </HStack>
        )}
        {mode === 'edit' && (
          <HStack spacing="4">
            <Button
              variant="outline"
              color="brand.green"
              borderColor="brand.green"
              minWidth="200px"
              fontFamily="poppins"
              _focus={{ outline: 'none' }}
              size="md"
              onClick={() => onCancel?.()}
              display={{ base: 'flex', sm: 'none', lg: 'flex' }}
            >
              Cancel
            </Button>
            {!isMobile && (
              <Button
                fontFamily="poppins"
                minWidth="200px"
                size="md"
                onClick={() => onSave?.()}
              >
                Save changes
              </Button>
            )}
            {isMobile && (
              <Button
                variant="outline"
                color="brand.green"
                borderColor="brand.green"
                fontFamily="poppins"
                fontWeight="normal"
                borderRadius="20px"
                _focus={{ outline: 'none' }}
                size="md"
                onClick={() => onSave?.()}
              >
                Save changes
              </Button>
            )}
          </HStack>
        )}
      </HStack>
    </Box>
  );
};

export default CollectionsHeader;
