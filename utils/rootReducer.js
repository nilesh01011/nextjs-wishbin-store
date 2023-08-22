import { combineReducers } from '@reduxjs/toolkit';
import cartSlice from '../slices/cartSlice';
import userSlice from '../slices/userSlice';
import orderSlice from '../slices/orderSlice';
import wishlistSlice from '../slices/wishlistSlice';
import tempOrderSlice from '../slices/tempOrderSlice';

const rootReducer = combineReducers({
    cart: cartSlice,
    user: userSlice,
    order: orderSlice,
    wishlist: wishlistSlice,
    tempOrder: tempOrderSlice,
    // checkoutCartItems: checkoutCartSlice
});

export default rootReducer;