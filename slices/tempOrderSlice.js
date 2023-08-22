import { createSlice } from '@reduxjs/toolkit';

export const tempOrderSlice = createSlice({
    name: 'tempOrders',
    initialState: [],
    reducers: {
        tempOrderItems: (state, action) => {
            return { ...action.payload }
        },
        clearOrderItems: () => {
            return [];
        }
    }
})

export const { tempOrderItems, clearOrderItems } = tempOrderSlice.actions;

export default tempOrderSlice.reducer