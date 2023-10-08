import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { logAddToCart, logRemoveFromCart, logViewCart } from '../../libs/analytics/logEvents';
import { CartItem } from '../../models';

interface CartState {
  cartItems: CartItem[];
  isCartOpen: boolean;
}

const initialState: CartState = {
  cartItems: [],
  isCartOpen: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = findItemInCart(state.cartItems, action.payload);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity || 1;
      } else {
        state.cartItems.push(action.payload);
      }

      logAddToCart(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<CartItem>) => {
      const itemToRemove = findItemInCart(state.cartItems, action.payload);
      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem !== itemToRemove
      );

      logRemoveFromCart(action.payload, itemToRemove.quantity);
    },
    updateCartItemQuantity: (state, action: PayloadAction<CartItem>) => {
      const itemToUpdate = findItemInCart(state.cartItems, action.payload);

      if (!itemToUpdate) {
        return;
      }

      if (itemToUpdate.quantity < action.payload.quantity) {
        logAddToCart({
          ...itemToUpdate,
          quantity: action.payload.quantity - itemToUpdate.quantity,
        });
      } else if (itemToUpdate.quantity > action.payload.quantity) {
        logRemoveFromCart({
          ...itemToUpdate,
          quantity: itemToUpdate.quantity - action.payload.quantity,
        });
      }

      itemToUpdate.quantity = action.payload.quantity;
    },
    updateCartItemNote: (state, action: PayloadAction<CartItem>) => {
      const itemToUpdate = state.cartItems.find(
        (cartItem) =>
          cartItem.item.id === action.payload.item.id &&
          cartItem.variant?.id === action.payload.variant?.id &&
          cartItem.addOns?.length === action.payload.addOns?.length &&
          (cartItem.addOns || []).every((addOn, index) => {
            return addOn.id === action.payload.addOns?.[index].id;
          })
      );

      if (!itemToUpdate) {
        return;
      }

      itemToUpdate.note = action.payload.note;
    },
    openCart: (state) => {
      state.isCartOpen = true;

      logViewCart(state.cartItems);
    },
    closeCart: (state) => {
      state.isCartOpen = false;
    },
  },
});

const findItemInCart = (cartItems: CartItem[], targetItem: CartItem) => {
  return cartItems.find(
    (cartItem) =>
      cartItem.item.id === targetItem.item.id &&
      cartItem.variant?.id === targetItem.variant?.id &&
      cartItem.addOns?.length === targetItem.addOns?.length &&
      (cartItem.addOns || []).every((addOn, index) => {
        return addOn.id === targetItem.addOns?.[index].id;
      }) &&
      cartItem.note == targetItem.note
  );
};

export const {
  addToCart,
  removeFromCart,
  updateCartItemNote,
  updateCartItemQuantity,
  openCart,
  closeCart,
} = cartSlice.actions;
export default cartSlice.reducer;
