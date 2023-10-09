import React from 'react';

import { Button, HStack } from '@chakra-ui/react';

export type FilterActionButtonsProps = {
  onClickCancel?: VoidFunction;
  isCancelDisabled?: boolean;
  onClickApply?: VoidFunction;
};

export const FilterActionButtons = (props: FilterActionButtonsProps) => {
  const { onClickApply, onClickCancel, isCancelDisabled } = props;
  return (
    <HStack spacing="2" justify="space-between">
      <Button
        size="md"
        variant="ghost"
        onClick={onClickCancel}
        isDisabled={isCancelDisabled}
      >
        Cancel
      </Button>
      <Button size="md" onClick={onClickApply}>
        Save
      </Button>
    </HStack>
  );
};
