import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';

interface Product {
    id: string;
    brand: string;
    catagory: string;
    color: string;
    pprice: string;
    productName: string;
    productno: string;
    receiveDate: string;
    sprice: string;
    supplier: string;
    supplierInvoice: string;
    username: string;

}

interface ProductState {
    products: Product[];
}

const initialState: ProductState = {
    products: [],
};

export const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        addProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.productno === action.payload.productno)
            if (exist) {
                swal("Oops!", "This Product ID is already exist!", "error");
            } else {
                state.products.push(action.payload);
            }

        },

        deleteProduct: (state, action) => {
            const id = action.payload;
            state.products = state.products.filter((product) => product.id !== id);
        },
        
        deleteAllProducts: (state) => {
            state.products = [];
        },
    },
});

export const { addProducts, deleteProduct, deleteAllProducts } = productSlice.actions;

export default productSlice.reducer;