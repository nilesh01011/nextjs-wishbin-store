import { createSlice } from '@reduxjs/toolkit'

export const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: [],
    },
    reducers: {
        addToCart: (state, action) => {
            const item = state.cartItems.find(
                (p) => p._id === action.payload._id
            );

            if (item) {
                item.quantity++;
                // 250 * 2 = 500 price 
                item.price = item.oneQuantityPrice * item.quantity;
            } else {
                state.cartItems.push({ ...action.payload, quantity: 1 });
            }
        },

        updateCart: (state, action) => {
            state.cartItems = state.cartItems.map((product) => {
                if (product._id === action.payload.id) {
                    if (action.payload.key === "quantity") {
                        product.price =
                            product.oneQuantityPrice * action.payload.val;
                    }
                    return { ...product, [action.payload.key]: action.payload.val };
                }
                return product;
            });
        },

        deleteFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(
                (p) => p._id !== action.payload.id
            );
        },

        emptyCart: (state) => {
            state.cartItems = [] // Return an empty array to clear the cart
        }
    },
})

// Action creators are generated for each case reducer function
export const { addToCart, updateCart, deleteFromCart, emptyCart } = cartSlice.actions

export default cartSlice.reducer