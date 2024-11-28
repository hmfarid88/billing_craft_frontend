'use client'
import React, { FormEvent, useState, useEffect } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct } from "@/app/store/productSlice";
import { toast } from 'react-toastify';

const Purchase = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
   
    const [category, setPcatatory] = useState("");
    const [brand, setBrand] = useState("");
    const [productName, setPname] = useState("");
    const [pprice, setPprice] = useState("");
    const [sprice, setRsale] = useState("");
    const [color, setColor] = useState("");
    const [supplier, setSupplier] = useState("");
    const [supplierInvoice, setSinvoice] = useState("");
    const [date, setDate] = useState("");
    const [productno, setPno] = useState("");
  
    const dispatch = useAppDispatch();

    const [categoryOption, setCategoryOption] = useState([]);
    const [brandOption, setBrandOption] = useState([]);
    const [productOption, setProductOption] = useState([]);
    const [colorOption, setColorOption] = useState([]);
    const [supplierOption, setSupplierOption] = useState([]);
    const [maxDate, setMaxDate] = useState('');
  
    useEffect(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      setMaxDate(formattedDate);
      setDate(formattedDate);
    }, []);

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getCategoryItem?username=${username}`)
          .then(response => response.json())
          .then(data => {
            const transformedData = data.map((item: any) => ({
              id: item.id,
              value: item.categoryItem,
              label: item.categoryItem
            }));
            setCategoryOption(transformedData);
          })
          .catch(error => console.error('Error fetching products:', error));
      }, [apiBaseUrl, username]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getBrandItem?username=${username}`)
          .then(response => response.json())
          .then(data => {
            const transformedData = data.map((item: any) => ({
              id: item.id,
              value: item.brandItem,
              label: item.brandItem
            }));
            setBrandOption(transformedData);
          })
          .catch(error => console.error('Error fetching products:', error));
      }, [apiBaseUrl, username]);
      
    useEffect(() => {
      fetch(`${apiBaseUrl}/api/getProductItem?username=${username}`)
        .then(response => response.json())
        .then(data => {
          const transformedData = data.map((item: any) => ({
            id: item.id,
            value: item.productItem,
            label: item.productItem
          }));
          setProductOption(transformedData);
        })
        .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);
  
    
    useEffect(() => {
      fetch(`${apiBaseUrl}/api/getColorItem?username=${username}`)
        .then(response => response.json())
        .then(data => {
          const transformedData = data.map((item: any) => ({
            id: item.id,
            value: item.colorItem,
            label: item.colorItem
          }));
          setColorOption(transformedData);
        })
        .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);
  
    useEffect(() => {
      fetch(`${apiBaseUrl}/api/getSupplierItem?username=${username}`)
        .then(response => response.json())
        .then(data => {
          const transformedData = data.map((item: any) => ({
            id: item.id,
            value: item.supplierItem,
            label: item.supplierItem
          }));
          setSupplierOption(transformedData);
        })
        .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);
  
    const handleSubmit = (e: any) => {
      e.preventDefault();
      const product = { id: uid(), username, category, brand, productName, pprice, sprice, color, supplier, supplierInvoice, date, productno }
      dispatch(addProducts(product));
      setPno("");
      document.getElementById('pno')?.focus();
    }
  
    const products = useAppSelector((state) => state.products.products);
    const viewdispatch = useAppDispatch();
  
    const handleDeleteProduct = (id: any) => {
      viewdispatch(deleteProduct(id));
    };
    const confirmAndHandleProductSubmit = (e: any) => {
      e.preventDefault();
      const isConfirmed = window.confirm("Are you sure to submit the products ?");
      if (isConfirmed) {
        ProductSubmit(e);
      }
  };
    const ProductSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
  
      try {
        if (products.length === 0) {
          toast.warning("Sorry, Your product list is empty!");
          return;
        }
        setPending(true)
          const response = await fetch(`${apiBaseUrl}/api/addProducts`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(products),
          });
  
          if (!response.ok) {
            const error = await response.json();
            toast.error(error.message);
          } else {
            dispatch(deleteAllProducts(username));
            toast.success("Product added successfully !");
          }
        
      } catch (error) {
        toast.error("Invalid product item !")
      }finally{
        setPending(false)
      }
    };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-center">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full items-center">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">CATEGORY</span>
                </div>
                <Select className="text-black" name="pcatagory" onChange={(selectedOption: any) => setPcatatory(selectedOption.value)} options={categoryOption} required />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">BRAND NAME</span>
                </div>
                <Select className="text-black" name="pbrand" onChange={(selectedOption: any) => setBrand(selectedOption.value)} options={brandOption} required />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">PRODUCT NAME</span>
                </div>
                <Select className="text-black" name="pname" onChange={(selectedOption: any) => setPname(selectedOption.value)} options={productOption} required />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">PURCHASE PRICE</span>
                </div>
                <input type="number" name="pprice" onChange={(e: any) => setPprice(e.target.value)} placeholder="Type here" className="border rounded-md p-2 w-full max-w-xs h-[40px] bg-white text-black" required />
              </label>

              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">SALE PRICE</span>
                </div>
                <input type="number" name="rsale" onChange={(e: any) => setRsale(e.target.value)} placeholder="Type here" className="border rounded-md p-2 w-full max-w-xs h-[40px] bg-white text-black" required />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">COLOR NAME</span>
                </div>
                <Select className="text-black" name="pcolor" onChange={(selectedOption: any) => setColor(selectedOption.value)} options={colorOption} required />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">SUPPLIER NAME</span>
                </div>
                <Select className="text-black" name="psupplier" onChange={(selectedOption: any) => setSupplier(selectedOption.value)} options={supplierOption} required />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">SUPPLIER INVOICE NO</span>
                </div>
                <input type="text" name="sinvoice" onChange={(e: any) => setSinvoice(e.target.value)} placeholder="Type here" className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" required />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">RECEIVE DATE</span>
                </div>
                <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="border rounded-md p-2 bg-white text-black  w-full max-w-xs h-[40px]" required />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">PRODUCT ID</span>
                </div>
                <input type="text" id="pno" maxLength={15} value={productno} name="pno" placeholder="Type here" onChange={(e: any) => setPno(e.target.value.replace(/\D/g, ""))} className="border rounded-md p-2  w-full max-w-xs h-[40px] bg-white text-black" required />
              </label>
              <label className="form-control w-full max-w-xs pt-7">
                <button type="submit" className="btn btn-accent btn-sm h-[40px] w-full max-w-xs" >Add Product</button>
              </label>
            </div>
          </form>

          <div className="flex-col items-center justify-center">
            <div className="overflow-x-auto h-96">
              <table className="table table-xs table-pin-rows">
                <thead>
                  <tr className="font-bold">
                    <th>Category</th>
                    <th>Description</th>
                    <th>P.Price</th>
                    <th>S.Price</th>
                    <th>Supplier</th>
                    <th>Product No</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((p) => (
                    <tr key={p.id}>
                      <td>{p.category}, {p.brand}</td>
                      <td>{p.productName}, {p.color}</td>
                      <td>{p.pprice}</td>
                      <td>{p.sprice}</td>
                      <td>{p.supplier}, {p.supplierInvoice}</td>
                      <td>{p.date}, {p.productno}</td>
                      <td>
                        <button onClick={() => {
                          handleDeleteProduct(p.id);
                        }} className="btn-xs rounded-md btn-outline btn-error"><RiDeleteBin6Line size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-center pt-12">
              <form onSubmit={confirmAndHandleProductSubmit}>
                <label className="form-control w-full max-w-sm pt-12">
                  <button
                    type="submit"
                    className="btn btn-success btn-sm h-[40px] w-full max-w-sm"
                    disabled={pending}
                  >
                    {pending ? "Submitting..." : "Submit Products"}
                  </button>
                </label>
              </form>

            </div>
          </div>

        </div>
  )
}

export default Purchase