import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';


interface Product {
    id: string;
    proId: string;
    brand: string;
    color: string;
    productName: string;
    productno: string;
    pprice: number;
   
}
interface VendorSaleState {
    products: Product[];
}

const initialState: VendorSaleState = {
    products: [],
};

export const vendorSaleSlice = createSlice({
    name: "vendorSale",
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
    }

})
export const { addProducts, deleteProduct, deleteAllProducts } = vendorSaleSlice.actions;

export default vendorSaleSlice.reducer;