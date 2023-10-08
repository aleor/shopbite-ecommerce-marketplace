import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { logViewCollection } from '../../libs/analytics/logEvents';
import { Collection } from '../../models';

interface CollectionsState {
  collections: Collection[];
  activeCollectionId: string;
}

const initialState: CollectionsState = {
  collections: [],
  activeCollectionId: null,
};

const collectionsSlice = createSlice({
  name: 'collections',
  initialState,
  reducers: {
    setCollections: (state, action: PayloadAction<Collection[]>) => {
      state.collections = action.payload;
    },
    setActiveCollection: (state, action: PayloadAction<string>) => {
      if (!state.collections) {
        return;
      }

      const previousActiveCollectionId = state.activeCollectionId;
      const newActiveCollectionId = action.payload;

      state.activeCollectionId = newActiveCollectionId;

      const activeCollection = state.collections.find(
        (collection) => collection.id === newActiveCollectionId
      );

      if (
        activeCollection &&
        previousActiveCollectionId !== newActiveCollectionId
      ) {
        logViewCollection(activeCollection);
      }
    },
  },
});

export const { setCollections, setActiveCollection } = collectionsSlice.actions;
export default collectionsSlice.reducer;
