import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Shop } from '../../models';

const initialState: Shop = {} as Shop;

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setShop: (state, action: PayloadAction<Shop>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setShop } = shopSlice.actions;
export default shopSlice.reducer;
