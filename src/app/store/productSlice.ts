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
    username:string;
  
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
        showProducts: (state) => state,
        addProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.productno === action.payload.productno)
            if (exist) {
                swal("Oops!", "This Product ID is already exist!", "error");
            } else {
                state.products.push(action.payload);
            }

        },
        updateProduct: (state, action) => {
            const { id, username, catagory, brand, productName, pprice, sprice, color, supplier, supplierInvoice, receiveDate, productno } = action.payload;
            const isProductExist = state.products.filter((product) => product.id === id);
            if (isProductExist) {
                isProductExist[0].username = username;
                isProductExist[0].catagory = catagory;
                isProductExist[0].brand = brand;
                isProductExist[0].productName = productName;
                isProductExist[0].pprice = pprice;
                isProductExist[0].sprice = sprice;
                isProductExist[0].color = color;
                isProductExist[0].supplier = supplier;
                isProductExist[0].supplierInvoice = supplierInvoice;
                isProductExist[0].receiveDate = receiveDate;
                isProductExist[0].productno = productno;
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
    },
});

export const { showProducts, addProducts, deleteProduct, deleteAllProducts, updateProduct } = productSlice.actions;

export default productSlice.reducer;