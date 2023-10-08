import { Heading, HStack } from '@chakra-ui/react';

const SectionHeader = ({
  title,
  children,
}: {
  title: string;
  children?: JSX.Element;
}) => {
  return (
    <HStack
      width="100%"
      justifyContent="space-between"
      spacing={{ base: 8, sm: 2, md: 8 }}
    >
      <Heading
        as="h4"
        fontFamily="poppins"
        fontWeight="semibold"
        fontSize={{ base: '24px', sm: '16px', md: '24px' }}
      >
        {title}
      </Heading>

      {children && <>{children}</>}

      {/* {isEditable ? (
        <IconButton
          icon={<HiOutlinePencil size="20px" />}
          onClick={() => {}}
          aria-label={`Edit ${title}`}
          variant="ghost"
          color="brand.green"
          _focus={{ outline: 'none' }}
          size="sm"
          visibility={'hidden'}
        />
      ) : (
        <Button
          fontFamily="poppins"
          minWidth="200px"
          size="md"
          onClick={() => {}}
          display={{ base: 'flex', sm: 'none', md: 'flex' }}
          isDisabled={false}
        >
          Save Changes
        </Button>
      )} */}
    </HStack>
  );
};

export default SectionHeader;
