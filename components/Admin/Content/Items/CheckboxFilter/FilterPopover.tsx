import React from 'react';
import { HiChevronDown } from 'react-icons/hi';

import {
    HStack, Icon, PopoverBody, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Text,
    useColorModeValue as mode, usePopoverContext
} from '@chakra-ui/react';

import { FilterActionButtons, FilterActionButtonsProps } from './FilterActionButtons';

type FilterPopoverButtonProps = {
  label: string;
  icon?: React.ElementType;
  selected?: boolean;
};

export const FilterPopoverButton = (props: FilterPopoverButtonProps) => {
  const { label, icon, selected } = props;

  return (
    <PopoverTrigger>
      <HStack
        justify="space-between"
        position="relative"
        as="button"
        fontSize="sm"
        borderWidth="1px"
        rounded="lg"
        paddingStart="3"
        paddingEnd="2"
        paddingY="2"
        spacing="1"
        width="100%"
        data-selected={selected || undefined}
        _expanded={{ bg: mode('gray.100', 'gray.700') }}
        _selected={{ bg: 'blue.50', borderColor: 'blue.500' }}
      >
        {icon && <Icon as={icon} boxSize="2" />}
        <Text fontWeight="normal" fontSize="12px" noOfLines={3} align="left">
          {label}
        </Text>
        <Icon as={HiChevronDown} fontSize="xl" color="gray.400" />
      </HStack>
    </PopoverTrigger>
  );
};

type FilterPopoverContentProps = FilterActionButtonsProps & {
  header?: string;
  children?: React.ReactNode;
};

export const FilterPopoverContent = (props: FilterPopoverContentProps) => {
  const { header, children, onClickCancel, onClickApply, isCancelDisabled } =
    props;
  const { onClose } = usePopoverContext();
  return (
    <PopoverContent
      _focus={{ shadow: 'none', outline: 0 }}
      _focusVisible={{ shadow: 'outline' }}
    >
      {header && <PopoverHeader srOnly>{header}</PopoverHeader>}
      <PopoverBody padding="6" maxHeight="250px" overflowY="scroll">
        {children}
      </PopoverBody>
      <PopoverFooter>
        <FilterActionButtons
          onClickCancel={() => {
            onClickCancel?.();
            onClose();
          }}
          isCancelDisabled={isCancelDisabled}
          onClickApply={() => {
            onClickApply?.();
            onClose();
          }}
        />
      </PopoverFooter>
    </PopoverContent>
  );
};
