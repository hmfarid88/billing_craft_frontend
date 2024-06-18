'use client'
import React, { FormEvent, useState, useEffect } from "react";
import { FcPlus } from "react-icons/fc";
import { RiDeleteBin6Line } from "react-icons/ri";
import Select from "react-select";
import { catagoryName } from '@/app/data/productData';
import { brandName } from '@/app/data/productData';
import { uid } from "uid";
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct } from "@/app/store/productSlice";
import { ToastContainer, toast } from 'react-toastify';


const Page: React.FC = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [pending1, setPending1] = useState(false);
  const [pending2, setPending2] = useState(false);
  const [pending3, setPending3] = useState(false);
  const [pending4, setPending4] = useState(false);
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';

  const [catagory, setPcatatory] = useState("");
  const [brand, setBrand] = useState("");
  const [productName, setPname] = useState("");
  const [pprice, setPprice] = useState("");
  const [sprice, setRsale] = useState("");
  const [color, setColor] = useState("");
  const [supplier, setSupplier] = useState("");
  const [supplierInvoice, setSinvoice] = useState("");
  const [receiveDate, setDate] = useState("");
  const [productno, setPno] = useState("");
  const dispatch = useAppDispatch();

  const [productItem, setProductItem] = useState("");
  const [colorItem, setColorItem] = useState("");
  const [supplierItem, setSupplierItem] = useState("");
  const productiteminfo = { productItem, username };
  const coloriteminfo = { colorItem, username };
  const supplieriteminfo = { supplierItem, username };

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
  }, []);

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
  }, [apiBaseUrl, productItem, username]);

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
  }, [apiBaseUrl, colorItem, username]);

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
  }, [apiBaseUrl, supplierItem, username]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const product = { id: uid(), username, catagory, brand, productName, pprice, sprice, color, supplier, supplierInvoice, receiveDate, productno }
    dispatch(addProducts(product));
    setPno("");
    document.getElementById('pno')?.focus();
  }

  const products = useAppSelector((state) => state.products.products);
  const viewdispatch = useAppDispatch();

  const handleDeleteProduct = (id: any) => {
    viewdispatch(deleteProduct(id));
  };
  const handleAllDeleteProduct = (id: any) => {
    viewdispatch(deleteAllProducts(id));
  };
  const handleProductitem = async (e: any) => {
    e.preventDefault();
    setPending1(true);
    setTimeout(() => {
      setPending1(false);
    }, 2000);
    if (!productItem) {
      setPending1(false);
      toast.error("Item is empty !")
    } else {
      try {
        const response = await fetch(`${apiBaseUrl}/api/addNewProduct`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productiteminfo),
        });

        if (response.ok) {
          setProductItem("");
          toast.success("Item added successfully !");
        } else {
          const data = await response.json();
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Invalid product name !")
      }
    }
  };
  const handleColoritem = async (e: any) => {
    e.preventDefault();
    setPending2(true);
    setTimeout(() => {
      setPending2(false);
    }, 2000);
    if (!colorItem) {
      setPending2(false);
      toast.error("Item is empty !")
    } else {
      try {
        const response = await fetch(`${apiBaseUrl}/api/addNewColor`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(coloriteminfo),
        });

        if (response.ok) {
          setColorItem("");
          toast.success("Item added successfully !");
        } else {
          const data = await response.json();
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Invalid color name !")
      }
    }
  };
  const handleSupplieritem = async (e: any) => {
    e.preventDefault();
    setPending3(true);
    setTimeout(() => {
      setPending3(false);
    }, 2000);
    if (!supplierItem) {
      setPending3(false);
      toast.error("Item is empty !")
    } else {
      try {
        const response = await fetch(`${apiBaseUrl}/api/addNewSupplier`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(supplieriteminfo),
        });

        if (response.ok) {
          setSupplierItem("");
          toast.success("Item added successfully !");
        } else {
          const data = await response.json();
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Invalid supplier name !")
      }
    }
  };

  const ProductSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending4(true);
    setTimeout(() => {
      setPending4(false);
    }, 2000);

    try {
      const allproduct = products;
      if (allproduct.length === 0) {
        setPending4(false);
        toast.error("Sorry, Your product list is empty !");
      } else {
        const response = await fetch(`${apiBaseUrl}/api/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(allproduct),
        });

        if (!response.ok) {
          const error = await response.json();
          toast.error(error.message);
        } else {
          const id = 123;
          handleAllDeleteProduct(id);
          toast.success("Product added successfully !");
        }
      }
    } catch (error) {
      toast.error("Invalid product item !")
    }
  };

  return (
    <div className="container-2xl">
      <div className='card card-actions  p-5'>
        <div className="flex w-full justify-end">
          <div>
            <a href="#my_modal_1" className="btn btn-circle btn-ghost"><FcPlus size={35} /></a>
            <div className="modal sm:modal-middle" role="dialog" id="my_modal_1">
              <div className="modal-box">
                <h3 className="font-bold text-lg">ADD ITEM</h3>

                <div className="flex w-full items-center justify-center p-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text-alt">ADD PRODUCT NAME</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <input type="text" value={productItem} name="productItem" onChange={(e: any) => setProductItem(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                      <button onClick={handleProductitem} disabled={pending1} className="btn btn-square btn-success">{pending1 ? "Adding..." : "ADD"}</button>
                    </div>
                  </label>
                </div>
                <div className="flex w-full items-center justify-center p-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text-alt">ADD COLOR</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <input type="text" value={colorItem} name="colorItem" onChange={(e: any) => setColorItem(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                      <button onClick={handleColoritem} disabled={pending2} className="btn btn-square btn-success">{pending2 ? "Adding..." : "ADD"}</button>
                    </div>
                  </label>
                </div>
                <div className="flex w-full items-center justify-center p-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text-alt">ADD SUPPLIER</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <input type="text" value={supplierItem} name="supplierItem" onChange={(e: any) => setSupplierItem(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                      <button onClick={handleSupplieritem} disabled={pending3} className="btn btn-square btn-success">{pending3 ? "Adding..." : "ADD"}</button>
                    </div>
                  </label>
                </div>
                <div className="modal-action">
                  <a href="#" className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h1 className='text-lg font-bold'>PRODUCT PURCHASE</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-center">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full items-center">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">CATEGORY</span>
                </div>
                <Select className="text-black" name="pcatagory" onChange={(selectedOption: any) => setPcatatory(selectedOption.value)} options={catagoryName} required />
              </label>
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text-alt">BRAND NAME</span>
                </div>
                <Select className="text-black" name="pbrand" onChange={(selectedOption: any) => setBrand(selectedOption.value)} options={brandName} required />
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
                <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} className="border rounded-md p-2 bg-white text-black  w-full max-w-xs h-[40px]" required />
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
              <table className="table table-pin-rows">
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
                      <td>{p.catagory}, {p.brand}</td>
                      <td>{p.productName}, {p.color}</td>
                      <td>{p.pprice}</td>
                      <td>{p.sprice}</td>
                      <td>{p.supplier}, {p.supplierInvoice}</td>
                      <td>{p.receiveDate}, {p.productno}</td>
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
              <form onSubmit={ProductSubmit}>
                <label className="form-control w-full max-w-sm pt-12">
                  <button
                    type="submit"
                    className="btn btn-success btn-sm h-[40px] w-full max-w-sm"
                    disabled={pending4}
                  >
                    {pending4 ? "Submitting..." : "Submit Products"}
                  </button>
                </label>
              </form>

            </div>
          </div>

        </div>
      </div>
      <ToastContainer autoClose={2000} theme="dark" />
    </div>
  )
}

export default Page