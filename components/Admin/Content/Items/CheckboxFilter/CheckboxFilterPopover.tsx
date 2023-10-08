import { useCallback } from 'react';

import { Popover } from '@chakra-ui/react';

import { CheckboxFilter } from './CheckboxFilter';
import { FilterPopoverButton, FilterPopoverContent } from './FilterPopover';
import { useFilterState } from './useFilterState';

export const CheckboxFilterPopover = ({
  data,
  preselectedValues,
  onChange,
}: {
  data: { label: string; value: string; count: number }[];
  onChange: (collectionIds: string[]) => void;
  preselectedValues?: string[];
}) => {
  const state = useFilterState({
    defaultValue: preselectedValues || [],
  });

  const getLabel = useCallback(() => {
    return state.value?.length
      ? state.value
          .map((v) => data.find((r) => r.value === v)?.label)
          ?.join(', ')
      : 'Select collections';
  }, [state.value]);

  return (
    <Popover placement="bottom-start">
      <FilterPopoverButton label={getLabel()} />

      <FilterPopoverContent
        isCancelDisabled={!state.canCancel}
        onClickApply={state.onSubmit}
        onClickCancel={() => {
          state.onReset();
          onChange([]);
        }}
      >
        <CheckboxFilter
          showSearch
          value={state.value}
          onChange={(v) => {
            state.onChange(v);
            onChange(v);
          }}
          options={data}
        />
      </FilterPopoverContent>
    </Popover>
  );
};
