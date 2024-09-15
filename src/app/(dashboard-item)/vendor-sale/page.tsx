'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, deleteAllProducts, deleteProduct } from "@/app/store/vendorSaleSlice";
import Select from "react-select";
import { uid } from 'uid';
import { DatePicker } from 'react-date-picker';
import { toast, ToastContainer } from "react-toastify";
import { FcManager } from "react-icons/fc";
import { FcPhone } from "react-icons/fc";
import { FcViewDetails } from "react-icons/fc";
import { FcCalendar } from "react-icons/fc";
import { FcDepartment } from "react-icons/fc";
import { FaCcMastercard } from "react-icons/fa6";
import { MdOutlineNavigateNext } from "react-icons/md";
type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const Page: React.FC = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const router = useRouter();
    const [date, setDate] = useState<Value>(new Date());
    const [pending, setPending] = useState(false);
    const [disValue, setDisValue] = useState("");
    const [offerValue, setOfferValue] = useState("");
    const [total, setTotal] = useState(0);

    const [productOption, setProductOption] = useState([]);
    const [vendorOption, setVendorOption] = useState([]);
    const [selectedProid, setSelectedProid] = useState("");

    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const saleProducts = useAppSelector((state) => state.vendorSale.products);
    const dispatch = useAppDispatch();

    const [vendor, setVendor] = useState("");
   
    const cid = uid();

    const productInfo = saleProducts.map(product => ({
        proId: product.proId,
        saleType:'vendor',
        discount:0,
        offer:0,
        saleDate: date,
        cid: cid,
        username: username
    }));
    const customerinfo = { cid, cname:vendor, username };

    useEffect(() => {
        calculateTotal();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [disValue, offerValue, saleProducts]);

    const calculateTotal = () => {
        const total = saleProducts.reduce((sum, p) => {
            return sum + p.pprice;
        }, 0);
        setTotal(total);
    };
    const totalQty = saleProducts.length;

    const handleDeleteProduct = (id: any) => {
        dispatch(deleteProduct(id));
    };


    const handleFinalSubmit = async (e: any) => {
        e.preventDefault();
        setPending(true);
        if (!vendor) {
            toast.error("Vendor name is required !");
            return;
        }
        try {
            const customerResponse = await fetch(`${apiBaseUrl}/api/saveCustomer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerinfo),
            });
            const customerResult = await customerResponse.json();

            if (!customerResponse.ok) {
                toast.error(customerResult.message);
                return;
            }

            const productResponse = await fetch(`${apiBaseUrl}/api/productSale`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productInfo),
            });

            if (!productResponse.ok) {
                toast.error("Product sale not submitted !");
                return;
            }

            dispatch(deleteAllProducts())
            const invoiceid = customerResult.cid;
            router.push(`/invoice?cid=${invoiceid}`);
        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        }
    };

    const handleProidSubmit = async (e: any) => {
        e.preventDefault();
        if (!selectedProid) {
            toast.error("Select an item first.")
            return;
        }
        try {
            const response = await fetch(`${apiBaseUrl}/api/getSingleProduct?proId=${selectedProid}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const productToVendor = {
                id: uid(),
                proId: data.proId,
                brand: data.brand,
                color: data.color,
                productName: data.productName,
                productno: data.productno,
                pprice: data.pprice,

            };
            dispatch(addProducts(productToVendor));

        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
            .then(response => response.json())
            .then(data => {
                const transformedData = data.map((item: any) => ({
                    id: item.proId,
                    value: item.proId,
                    label: item.productName + item.productno,
                }));
                setProductOption(transformedData);
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
            setVendorOption(transformedData);
          })
          .catch(error => console.error('Error fetching products:', error));
      }, [apiBaseUrl, username]);
    return (
        <div className='container-2xl min-h-[calc(100vh-228px)]'>
            <div className="flex flex-col">
                <div className="flex justify-start font-bold pt-5 px-10 pb-0">
                    <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
                </div>
                <div className="flex flex-col w-full">
                    <div className="divider divider-accent tracking-widest font-bold p-5">VENDOR SALE AREA</div>
                </div>
                <div className="flex items-center justify-center z-10">
                    <Select className="text-black w-64 md:w-96" autoFocus={true} onChange={(selectedOption: any) => setSelectedProid(selectedOption.value)} options={productOption} />
                    <button onClick={handleProidSubmit} className='btn btn-outline btn-success btn-sm ml-2'>ADD</button>
                </div>
                <div className="flex items-center justify-center w-full p-5">
                    <div className="overflow-x-auto max-h-96">
                        <table className="table table-pin-rows">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>DESCRIPTION</th>
                                    <th>PRODUCT NO</th>
                                    <th>VALUE</th>
                                    <th>ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                {saleProducts?.map((p, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{p.brand}, {p.productName} {p.color}</td>
                                        <td>{p.productno}</td>
                                        <td>{p.pprice.toLocaleString('en-IN')}</td>
                                        <td className="flex justify-between gap-3">
                                            <button onClick={() => {
                                                handleDeleteProduct(p.id);
                                            }} className="btn btn-xs btn-error"> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td className="text-lg font-semibold">TOTAL</td>
                                    <td className="text-lg font-semibold">{totalQty}</td>
                                    <td className="text-lg font-semibold">{total.toLocaleString('en-IN')}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between">
        <div className="flex w-full justify-center p-5">
          <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-5">
            <div className="card-title">Select Vendor</div>
            <Select className="text-black h-[38px] w-64" onChange={(selectedOption: any) => setVendor(selectedOption.value)} options={vendorOption} />
            <button onClick={handleFinalSubmit} disabled={pending} className="btn w-xs h-[38px] btn-success btn-outline font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : "SUBMIT"}</button>
          </div>
        </div>
      </div>
           
            <ToastContainer autoClose={1000} theme="dark" />
        </div>
    )
}

export default Page