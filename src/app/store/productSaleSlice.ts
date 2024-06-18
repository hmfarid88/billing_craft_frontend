import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';


interface Product {
    id: string;
    proId: string;
    brand: string;
    color: string;
    productName: string;
    productno: string;
    sprice: number;
    discount: number;
    offer: number;
}
interface ProductSaleState {
    products: Product[];
}

const initialState: ProductSaleState = {
    products: [],
};

export const productSaleSlice = createSlice({
    name: "productTosale",
    initialState,
    reducers: {
        showProducts: (state) => state,
        addProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.productno === action.payload.productno)
            if (exist) {
                swal("Oops!", "This Product ID is already exist!", "error");
            } else {
                state.products.push(action.payload);
            }

        },
        updateDiscount: (state, action) => {
            const { id, discount } = action.payload;
            const product = state.products.find(product => product.id === id);
            if (product) {
                product.discount = discount;
            }
        },
        updateOffer: (state, action) => {
            const { id, offer } = action.payload;
            const product = state.products.find(product => product.id === id);
            if (product) {
                product.offer = offer;
            }
        },
        deleteProduct: (state, action) => {
            const id = action.payload;
            state.products = state.products.filter((product) => product.id !== id);
        },
        deleteAllProducts: (state, action) => {
            const id = action.payload;
            state.products = state.products.filter(product => product.id == id);
        },
    }

})
export const {showProducts, addProducts, updateDiscount, updateOffer, deleteProduct, deleteAllProducts } = productSaleSlice.actions;

export default productSaleSlice.reducer;