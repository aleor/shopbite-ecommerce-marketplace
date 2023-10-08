import { configureStore } from '@reduxjs/toolkit';

import cartReducer from '../features/cart/cart-slice';
import collectionsReducer from '../features/collections/collections-slice';
import itemsReducer from '../features/items/items-slice';
import searchReducer from '../features/search/search-slice';
import shopReducer from '../features/shop/shop-slice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    shop: shopReducer,
    collections: collectionsReducer,
    items: itemsReducer,
    cart: cartReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
