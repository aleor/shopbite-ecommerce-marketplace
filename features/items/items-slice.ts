import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { logViewItem } from '../../libs/analytics/logEvents';
import { Item } from '../../models';

interface ItemState {
  selectedItem: Item;
  isModalOpen: boolean;
}

const initialState: ItemState = {
  selectedItem: null,
  isModalOpen: false,
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setSelectedItem: (state, action: PayloadAction<Item | null>) => {
      state.selectedItem = action.payload;
    },
    showModal: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload;
    },
    selectAndShowDetails: (state, action: PayloadAction<Item | null>) => {
      state.selectedItem = action.payload;
      state.isModalOpen = true;

      logViewItem(action.payload);
    },
  },
});

export const { setSelectedItem, showModal, selectAndShowDetails } =
  itemsSlice.actions;
export default itemsSlice.reducer;
