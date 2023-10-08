import pDebounce from 'p-debounce';

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { logSearchEvent } from '../../libs/analytics/logEvents';

interface SearchState {
  term: string;
}

const initialState: SearchState = {
  term: '',
};

const debouncedSearchLogger = pDebounce(logSearchEvent, 1000);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setTerm: (state, action: PayloadAction<string>) => {
      state.term = action.payload;

      if (state.term?.trim()?.length > 0) {
        debouncedSearchLogger(state.term);
      }
    },
    reset: (state) => {
      state.term = '';
    },
  },
});

export const { setTerm, reset } = searchSlice.actions;
export default searchSlice.reducer;
