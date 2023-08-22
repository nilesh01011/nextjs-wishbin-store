import { createSlice } from '@reduxjs/toolkit';

export const orderSlice = createSlice({
    name: 'order',
    initialState: {
        orderItems: [],
    },
    reducers: {
        addOrderItems: (state, action) => {

            // console.log('ordersItems data :', action.payload)

            if (!state.orderItems) {
                return [];
            }

            state.orderItems.push(action.payload);

        },
        deleteOrderItems: (state, action) => {
            state.orderItems = state.orderItems.filter(
                (o) => o._id !== action.payload.id
            );
        },
        orderNotFound: (state) => {
            state.orderItems = [] // Return an empty array to clear the orderItems
        }
    }
})

export const { orderNotFound, deleteOrderItems, addOrderItems } = orderSlice.actions;

export default orderSlice.reducer