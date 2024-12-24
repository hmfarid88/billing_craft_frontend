'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, updateSprice, updateDiscount, updateOffer, deleteAllProducts, deleteProduct } from "@/app/store/productSaleSlice";
import Select from "react-select";
import { uid } from 'uid';
import { toast, ToastContainer } from "react-toastify";
import { FcManager } from "react-icons/fc";
import { FcPhone } from "react-icons/fc";
import { FcViewDetails } from "react-icons/fc";
import { FaCcMastercard } from "react-icons/fa6";
import { MdOutlineNavigateNext } from "react-icons/md";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { RxCrossCircled } from "react-icons/rx";
import { HiCurrencyBangladeshi } from "react-icons/hi2";
import { FaHandHoldingMedical } from "react-icons/fa";
import { RiHandCoinLine } from "react-icons/ri";

const Page: React.FC = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [date, setDate] = useState('');
  const [pending, setPending] = useState(false);
  const [disValue, setDisValue] = useState("");
  const [sprice, setSprice] = useState<{ [key: string]: string | number }>({});
  const [offerValue, setOfferValue] = useState("");
  const [total, setTotal] = useState(0);

  const [productOption, setProductOption] = useState([]);
  const [selectedProid, setSelectedProid] = useState("");
  const [selectedProidOption, setSelectedProidOption] = useState(null);

  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const saleProducts = useAppSelector((state) => state.productTosale.products);
  const dispatch = useAppDispatch();

  const [cname, setCname] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [cardPay, setCard] = useState(0);
  const [vat, setVat] = useState<number>(0)
  const vatAmount = (total * vat) / 100;
  const [received, setReceived] = useState('');
  const [returnAmount, setReturnAmount] = useState(0);

  const cid = uid();
  const [maxDate, setMaxDate] = useState("");
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setMaxDate(formattedDate);
    setDate(formattedDate);
  }, []);

  const handleReceivedChange = (e: any) => {
    const receivedValue = e.target.value;
    setReceived(receivedValue);
    const returnAmountValue = receivedValue - (Number(total) + Number(vatAmount) - Number(cardPay));
    setReturnAmount(returnAmountValue);
  };
  const selectRef = useRef<any>(null);
  // const selectRef = useRef(null); // Reference for the select
  const buttonRef = useRef<HTMLButtonElement>(null); // Reference for the button

  const handleOptionChange = (selectedOption: any) => {
    setSelectedProid(selectedOption.value);
    setSelectedProidOption(selectedOption);

    // Focus the button after selecting an option
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  };
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


  const handleUpdateDiscount = (id: any) => {
    dispatch(updateDiscount({ id, discount: disValue }));
  };
  const handleUpdateOffer = (id: any) => {
    dispatch(updateOffer({ id, offer: offerValue }));
  };


  const handleProidSubmit = async (e: any) => {
    e.preventDefault();
    if (!selectedProid) {
      toast.info("Valid product not found !")
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
          username: username
        };
        dispatch(addProducts(productToSale));
        setSelectedProid("");
        setSelectedProidOption(null);
        if (selectRef.current) {
          selectRef.current.focus();
        }
      } else {
        toast.error("Incomplete data information !")
      }

    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const productInfo = saleProducts.map(product => ({
    sprice: product.sprice,
    discount: product.discount,
    offer: product.offer,
    proId: product.proId,
    date: date,
    cid: cid,
    saleType: 'customer',
    username: username
  }));
  const handleFinalSubmit = async (e: any) => {
    e.preventDefault();
    if (!cname || !phoneNumber) {
      toast.info("Customer & Phone Number IS Required !");
      return;
    }
    if (productInfo.length === 0) {
      toast.error("Your product list is empty!");
      return;
    }

    const salesRequest = {
      customer: {
        cid, cname, phoneNumber, address, cardPay, vatAmount, received, username
      },
      salesItems: productInfo,
    };
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/sales/productSale`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(salesRequest),
      });

      if (!response.ok) {
        toast.error("Product sale not submitted !");
        return;
      }

      setCname("");
      setPhone("");
      setCard(0);
      setAddress("");
      setReceived('');

      dispatch(deleteAllProducts(username));
      router.push(`/invoice?cid=${cid}`);

    } catch (error: any) {
      toast.error("An error occurred: " + error.message);
    } finally {
      setPending(false);
    }
  };

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const transformedData = data.map((item: any) => ({
          id: item.proId,
          value: item.proId,
          label: item.productName + ", " + item.productno,
        }));
        setProductOption(transformedData);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);


  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getVatPercent?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setVat(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  return (
    <div className='container-2xl min-h-[calc(100vh-228px)]'>
      <div className="flex flex-col">
        <div className="flex pt-5 px-10 pb-0">
          <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)} max={maxDate} value={date} className="input input-ghost" />
        </div>
        <div className="flex flex-col w-full">
          <div className="divider divider-accent tracking-widest font-bold p-5">SALES AREA</div>
        </div>
        <div className="flex items-center justify-center z-10">
          <Select
            className="text-black w-64 md:w-96"
            ref={selectRef}
            autoFocus={true}
            value={selectedProidOption}
            onChange={handleOptionChange}
            options={productOption}
          />
          <button onClick={handleProidSubmit} ref={buttonRef} className='btn btn-outline btn-success btn-sm ml-2'>ADD</button>
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
                    <td>
                      <div className="flex flex-col gap-2">
                        <input
                          type="number"
                          name="sprice"
                          value={sprice[p.id] !== undefined ? sprice[p.id] : p.sprice}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            const updatedValue = e.target.value;
                            setSprice((prev: any) => ({
                              ...prev,
                              [p.id]: updatedValue === "" ? "" : Number(updatedValue),
                            }));
                          }}
                          className="bg-base-100 w-20 p-1 rounded-md border"
                        />
                        <button
                          onClick={() => {
                            const updatedValue = sprice[p.id] !== undefined ? sprice[p.id] : p.sprice;
                            if (updatedValue !== "") {
                              dispatch(updateSprice({ id: p.id, sprice: Number(updatedValue) }));
                            }
                          }}
                          className="btn btn-xs btn-outline w-20"
                        >
                          Apply
                        </button>
                      </div>
                    </td>

                    <td><div className="flex flex-col gap-2">
                      <input type="number" name="discount" placeholder="0.00" onChange={(e: any) => setDisValue(e.target.value)} className="bg-base-100 w-20 p-1 rounded-md border" />
                      <button onClick={() => {
                        handleUpdateDiscount(p.id);
                      }} className="btn btn-xs btn-outline w-20"> Apply
                      </button></div>
                    </td>
                    <td><div className="flex flex-col gap-2"><input type="number" name="offer" placeholder="0.00" onChange={(e: any) => setOfferValue(e.target.value)} className="bg-base-100 w-20 p-1 rounded-md border" />
                      <button onClick={() => {
                        handleUpdateOffer(p.id);
                      }} className="btn btn-xs btn-outline w-20"> Apply
                      </button>
                    </div>
                    </td>
                    <td>{(p.sprice - p.discount - p.offer).toLocaleString('en-IN')}</td>
                    <td>

                      <button onClick={() => {
                        handleDeleteProduct(p.id);
                      }} className="btn btn-sm btn-circle btn-ghost text-error"> <RxCrossCircled size={24} />
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
      <div className="flex flex-col md:flex-row justify-center items-center">
        <div className="flex w-full justify-center p-5">
          <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-2">
            <h1 className="font-bold text-sm">CUSTOMER INFORMATION</h1>
            <label className="input input-bordered flex items-center gap-2">
              <FcManager size={20} />
              <input type="text" name="customer" className="grow" onChange={(e: any) => setCname(e.target.value)} placeholder="Customer Name" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FcPhone size={20} />
              <input type="text" name="phone" className="grow" maxLength={11} onChange={(e: any) => setPhone(e.target.value.replace(/\D/g, ""))} value={phoneNumber} placeholder="Mobile Number" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FcViewDetails size={20} />
              <input type="text" name="address" className="grow" onChange={(e: any) => setAddress(e.target.value)} placeholder="Address" />
            </label>
          </div>
        </div>
        <div className="flex w-full justify-center p-5">
          <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-2">
            <h1 className="font-bold text-sm">PAYMENT INFORMATION</h1>
            <label className="input input-bordered flex items-center gap-2">
              <HiOutlineReceiptTax size={20} />
              <span className="text-sm">VAT</span>
              <input type="number" className="grow" value={vatAmount.toFixed(2)} readOnly placeholder="Vat" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <HiCurrencyBangladeshi size={20} />
              <span className="text-sm">TOTAL</span>
              <input type="number" className="grow" value={(total + vatAmount).toFixed(2)} readOnly placeholder="Total" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <FaCcMastercard size={20} />
              <input type="number" className="grow" onChange={(e: any) => setCard(e.target.value)} placeholder="Card Payment" />
            </label>

          </div>
        </div>
        <div className="flex w-full justify-center p-5">
          <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-2">
            <h1 className="font-bold text-sm">EXCHANGE INFORMATION</h1>
            <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
              <HiCurrencyBangladeshi size={20} />
              <input type="text" className="grow" value={Number((total + vatAmount).toFixed(2)).toLocaleString('en-IN')} placeholder="Total Amount" readOnly />
            </label>
            <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
              <FaHandHoldingMedical size={20} />
              <input type="number" className="grow" value={received} onChange={handleReceivedChange} placeholder="Received Amount" />
            </label>
            <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
              <RiHandCoinLine size={20} />
              <input type="text" className="grow" value={returnAmount.toFixed(2)} placeholder="Return Amount" readOnly />
            </label>
          </div>
        </div>
        <div className="flex w-full justify-center p-2">
          <div className="card shadow shadow-slate-500 max-w-lg items-center justify-center gap-3 p-2">
            <h1 className="tracking-widest font-bold">SUBMIT</h1>
            <button onClick={handleFinalSubmit} disabled={pending} className="btn btn-success btn-circle font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : <MdOutlineNavigateNext size={36} />}</button>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1000} theme="dark" />
    </div>
  )
}

export default Page