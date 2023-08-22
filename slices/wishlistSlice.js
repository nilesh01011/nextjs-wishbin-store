import { createSlice } from '@reduxjs/toolkit'

export const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        wishlistItems: [],
    },
    reducers: {
        addToWishlistItems: (state, action) => {
            state.wishlistItems.push({ ...action.payload });
        },

        deleteFromWishlistItems: (state, action) => {
            state.wishlistItems = state.wishlistItems.filter(
                (p) => p._id !== action.payload.id
            );
        },
        emptyWishlistItems: (state) => {
            state.wishlistItems = [];
        }
    },
})

// Action creators are generated for each case reducer function
export const { addToWishlistItems, deleteFromWishlistItems, emptyWishlistItems } = wishlistSlice.actions

export default wishlistSlice.reducer