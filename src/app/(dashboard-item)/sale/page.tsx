'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, updateDiscount, updateOffer, deleteAllProducts, deleteProduct } from "@/app/store/productSaleSlice";
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
  const [selectedProid, setSelectedProid] = useState("");

  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const saleProducts = useAppSelector((state) => state.productTosale.products);
  const dispatch = useAppDispatch();

  const [cname, setCname] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cardPay, setCard] = useState("");
  const [dueAmount, setDue] = useState("");
  const [vatAmount, setVat] = useState("");
  const cid = uid();

  const productInfo = saleProducts.map(product => ({
    discount: product.discount,
    offer: product.offer,
    proId: product.proId,
    saleDate: date,
    cid: cid,
    username: username
  }));
  const customerinfo = { cid, cname, phoneNumber, address, cardPay, dueAmount, vatAmount, username };

  useEffect(() => {
    calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disValue, offerValue, saleProducts]);

  const calculateTotal = () => {
    const total = saleProducts.reduce((sum, p) => {
      return sum + (((p.sprice - p.discount) - p.offer));
    }, 0);
    setTotal(total);
  };
  const totalQty = saleProducts.length;

  const handleDeleteProduct = (id: any) => {
    dispatch(deleteProduct(id));
  };
  const handleAllDeleteProduct = (id: any) => {
    dispatch(deleteAllProducts(id));
  };
  const handleUpdateDiscount = (id: any) => {
    dispatch(updateDiscount({ id, discount: disValue }));
  };
  const handleUpdateOffer = (id: any) => {
    dispatch(updateOffer({ id, offer: offerValue }));
  };

  const handleFinalSubmit = async (e: any) => {
    e.preventDefault();
    setPending(true);

    // Reset pending state after 2 seconds
    setTimeout(() => {
      setPending(false);
    }, 2000);

    // Validation
    if (!cname) {
      toast.error("Customer name is required !");
      return;
    }
    if (!phoneNumber) {
      toast.error("Phone number is required !");
      return;
    }

    try {
      // Submit customer info
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

      // Submit product info
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

      // toast.success("sale success")
      const id = 123;
      handleAllDeleteProduct(id);

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
      if (data.proId && data.brand && data.color && data.productName && data.productno && data.sprice) {

        const productToSale = {
          id: uid(),
          proId: data.proId,
          brand: data.brand,
          color: data.color,
          productName: data.productName,
          productno: data.productno,
          sprice: data.sprice,
          discount: 0,
          offer: 0,
        };
        dispatch(addProducts(productToSale));
      } else {
        toast.error("Incomplete data information !")
      }

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

  return (
    <div className='container-2xl min-h-[calc(100vh-228px)]'>
      <div className="flex flex-col">
        <div className="flex justify-start font-bold pt-5 px-10 pb-0">
          <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
        </div>
        <div className="flex flex-col w-full">
          <div className="divider divider-accent tracking-widest font-bold p-5">SALE AREA</div>
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
                  <th>OWN DISCOUNT</th>
                  <th>COMPANY OFFER</th>
                  <th>SUB TOTAL</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {saleProducts?.map((p, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{p.brand}, {p.productName} {p.color}</td>
                    <td>{p.productno}</td>
                    <td>{p.sprice.toLocaleString('en-IN')}</td>
                    <td><input type="number" name="discount" placeholder="0.00" onChange={(e: any) => setDisValue(e.target.value)} className="bg-base-100 w-20 p-1 rounded-md border" /></td>
                    <td><input type="number" name="offer" placeholder="0.00" onChange={(e: any) => setOfferValue(e.target.value)} className="bg-base-100 w-20 p-1 rounded-md border" /></td>
                    <td>{(p.sprice - p.discount - p.offer).toLocaleString('en-IN')}</td>
                    <td className="flex justify-between gap-3">
                      <button onClick={() => {
                        handleUpdateDiscount(p.id);
                      }} className="btn btn-xs btn-success"> Discount
                      </button>
                      <button onClick={() => {
                        handleUpdateOffer(p.id);
                      }} className="btn btn-xs btn-info"> Offer
                      </button>
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
                  <td></td>
                  <td></td>
                  <td></td>
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
            <h1 className="tracking-widest font-bold">CUSTOMER INFORMATION</h1>
            <label className="input input-bordered flex items-center gap-2">
              <FcManager size={20} />
              <input type="text" className="grow" onChange={(e: any) => setCname(e.target.value)} placeholder="Customer Name" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FcPhone size={20} />
              <input type="text" className="grow" maxLength={11} onChange={(e: any) => setPhone(e.target.value.replace(/\D/g, ""))} value={phoneNumber} placeholder="Mobile Number" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FcViewDetails size={20} />
              <input type="text" className="grow" onChange={(e: any) => setAddress(e.target.value)} placeholder="Address" />
            </label>
          </div>
        </div>
        <div className="flex w-full justify-center p-5">
          <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-5">
            <h1 className="tracking-widest font-bold">PAYMENT INFORMATION</h1>
            <label className="input input-bordered flex items-center gap-2">
              <FaCcMastercard size={20} />
              <input type="number" className="grow" onChange={(e: any) => setCard(e.target.value)} placeholder="Card Amount" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FcCalendar size={20} />
              <input type="number" className="grow" onChange={(e: any) => setDue(e.target.value)} placeholder="Due Amount" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FcDepartment size={20} />
              <input type="number" className="grow" onChange={(e: any) => setVat(e.target.value)} placeholder="Vat Amount" />
            </label>
          </div>
        </div>
        <div className="flex w-full justify-center p-5">
          <div className="card shadow shadow-slate-500 max-w-lg items-center justify-center gap-3 p-5">
            <h1 className="tracking-widest font-bold">SUBMIT</h1>
            <button onClick={handleFinalSubmit} disabled={pending} className="btn btn-success btn-circle font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : <MdOutlineNavigateNext size={36} />}</button>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={2000} theme="dark" />
    </div>
  )
}

export default Page