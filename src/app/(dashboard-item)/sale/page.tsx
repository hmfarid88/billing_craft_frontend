'use client'
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from "@/app/store";
import { addProducts, updateSprice, updateDiscount, updateOffer, deleteAllProducts, deleteProduct, selectTotalQuantity } from "@/app/store/productSaleSlice";
import Select from "react-select";
import { uid } from 'uid';
import { toast, ToastContainer } from "react-toastify";
import { FcManager } from "react-icons/fc";
import { FcPhone } from "react-icons/fc";
import { FcViewDetails } from "react-icons/fc";
import { MdOutlineNavigateNext } from "react-icons/md";
import { HiOutlineReceiptTax } from "react-icons/hi";
import { RxCrossCircled } from "react-icons/rx";
import { FaHandHoldingMedical } from "react-icons/fa";
import { RiHandCoinLine } from "react-icons/ri";


const Page: React.FC = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [date, setDate] = useState('');
  const [pending, setPending] = useState(false);
  const [disValue, setDisValue] = useState("");
  const [disPercent, setDisPercent] = useState<number>(0);
  const [sprice, setSprice] = useState<{ [key: string]: string | number }>({});
  const [offerValue, setOfferValue] = useState("");
  const [total, setTotal] = useState(0);

  const [productOption, setProductOption] = useState([]);
  const [selectedProidOption, setSelectedProidOption] = useState(null);

  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const saleProducts = useAppSelector((state) => state.productTosale.products);
  const totalQuantity = useAppSelector(selectTotalQuantity);
  const dispatch = useAppDispatch();

  const [cname, setCname] = useState("");
  const [dueName, setDueName] = useState("");
  const [dueAmount, setDueAmount] = useState("");
  const [walletName, setWalletName] = useState("");
  const [walletAmount, setWalletAmount] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [soldby, setSoldby] = useState("");
  const [cardPay, setCard] = useState(0);
  const [vat, setVat] = useState<number>(0)
  const vatAmount = (total * vat) / 100;
  const [received, setReceived] = useState('');
  const [returnAmount, setReturnAmount] = useState(0);
  const [due, setDue] = useState(false);

  const cid = uid();

  const [minDate, setMinDate] = useState('');
    const [maxDate, setMaxDate] = useState('');
  
    useEffect(() => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
  
      const formattedMaxDate = `${year}-${month}-${day}`;
      const formattedMinDate = `${year}-${month}-01`; 
  
      setMaxDate(formattedMaxDate);
      setMinDate(formattedMinDate);
  
      // Optionally set default date = today
      setDate(formattedMaxDate);
    }, []);
  

  const handleReceivedChange = (e: any) => {
    const receivedValue = e.target.value;
    setReceived(receivedValue);
    const returnAmountValue = receivedValue - (Number(total) + Number(vatAmount) - Number(walletAmount));
    setReturnAmount(returnAmountValue);
  };
  const selectRef = useRef<any>(null);

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

  const handlePercentDiscount = (id: any) => {
    const sprice = saleProducts.find((product) => product.id === id)?.sprice || 0;
    const discount = (sprice * disPercent) / 100;
    dispatch(updateDiscount({ id, discount }));
  };

  const handleUpdateOffer = (id: any) => {
    dispatch(updateOffer({ id, offer: offerValue }));
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
  //   const handleFinalSubmit = async (e: any) => {
  //     e.preventDefault();
  //     if (!cname || !phoneNumber) {
  //       toast.info("Customer & phone number empty!");
  //       return;
  //     }
  //     if (productInfo.length === 0) {
  //       toast.error("Your product list is empty!");
  //       return;
  //     }
  //     if (walletName && !walletAmount) {
  //       toast.info("Please fill wallet amount");
  //       return;
  //     }
  //     if (!walletName && walletAmount) {
  //       toast.info("Please select wallet name");
  //       return;
  //     }
  //     if (Number(walletAmount) <= 0) {
  //   toast.info("Wallet amount must be greater than zero");
  //   return;
  // }
  //     if (walletName && walletAmount) {
  //       try {
  //         const response = await fetch(`${apiBaseUrl}/payment/walletPayment`, {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ date, paymentName: walletName, paymentType: "payment", paymentNote: "pos transaction", amount: walletAmount, username }),
  //         });

  //         if (!response.ok) {
  //           const data = await response.json();
  //           toast.error(data.message);
  //           return;
  //         }
  //       } catch (error) {
  //         toast.error("Invalid transaction !")
  //       }
  //     }
  //     const salesRequest = {
  //       customer: {
  //         cid, cname, phoneNumber, address, soldby, cardPay: walletAmount, vatAmount, received, username
  //       },
  //       salesItems: productInfo,
  //     };
  //     setPending(true);
  //     try {
  //       const response = await fetch(`${apiBaseUrl}/sales/productSale`, {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(salesRequest),
  //       });

  //       if (!response.ok) {
  //         toast.error("Product sale not submitted !");
  //         return;
  //       }

  //       setCname("");
  //       setPhone("");
  //       setCard(0);
  //       setAddress("");
  //       setSoldby("");
  //       setReceived('');

  //       dispatch(deleteAllProducts(username));
  //       router.push(`/invoice?cid=${cid}`);

  //     } catch (error: any) {
  //       toast.error("An error occurred: " + error.message);
  //     } finally {
  //       setPending(false);
  //     }
  //   };
  const handleFinalSubmit = async (e: any) => {
    e.preventDefault();

    // ✅ Prevent multiple submissions
    if (pending) return;
    setPending(true);

    // ✅ Basic validations
    if (!cname || !phoneNumber) {
      toast.info("Customer & phone number empty!");
      setPending(false);
      return;
    }

    if (productInfo.length === 0) {
      toast.error("Your product list is empty!");
      setPending(false);
      return;
    }

    if (walletName && !walletAmount) {
      toast.info("Please fill wallet amount");
      setPending(false);
      return;
    }

    if (!walletName && walletAmount) {
      toast.info("Please select wallet name");
      setPending(false);
      return;
    }

    if (walletAmount && Number(walletAmount) <= 0) {
      toast.info("Wallet amount must be greater than zero");
      setPending(false);
      return;
    }

    // ✅ Wallet payment first if needed
    if (walletName && walletAmount) {
      try {
        const response = await fetch(`${apiBaseUrl}/payment/walletPayment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date,
            paymentName: walletName,
            paymentType: "payment",
            paymentNote: "pos transaction",
            amount: walletAmount,
            username
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          toast.error(data.message);
          setPending(false); 
          return;
        }
      } catch (error) {
        toast.error("Invalid transaction !");
        setPending(false); 
        return;
      }
    }

    // ✅ Final sales submission
    const salesRequest = {
      customer: {
        cid, cname, phoneNumber, address, soldby, cardPay: walletAmount, vatAmount, received, username
      },
      salesItems: productInfo,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/sales/productSale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salesRequest),
      });

      if (!response.ok) {
        toast.error("Product sale not submitted !");
        return;
      }

      // ✅ Reset state after successful sale
      setCname("");
      setPhone("");
      setCard(0);
      setAddress("");
      setSoldby("");
      setReceived('');
      dispatch(deleteAllProducts(username));
      router.push(`/invoice?cid=${cid}`);

    } catch (error: any) {
      toast.error("An error occurred: " + error.message);
    } finally {
      setPending(false);
    }
  };

  const handleDueSubmit = async (e: any) => {
    e.preventDefault();

    if (pending) return;
    setPending(true);

    // 1. Basic validations
    if (!dueName || !dueAmount) {
      toast.info("No customer selected or due amount missing!");
      return;
    }

    if (productInfo.length === 0) {
      toast.error("Your product list is empty!");
      return;
    }
 if (walletName && !walletAmount) {
      toast.info("Please fill wallet amount");
      setPending(false);
      return;
    }

    if (!walletName && walletAmount) {
      toast.info("Please select wallet name");
      setPending(false);
      return;
    }

    if (walletAmount && Number(walletAmount) <= 0) {
      toast.info("Wallet amount must be greater than zero");
      setPending(false);
      return;
    }

    // ✅ Wallet payment first if needed
    if (walletName && walletAmount) {
      try {
        const response = await fetch(`${apiBaseUrl}/payment/walletPayment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            date,
            paymentName: walletName,
            paymentType: "payment",
            paymentNote: "pos transaction",
            amount: walletAmount,
            username
          }),
        });

        if (!response.ok) {
          const data = await response.json();
          toast.error(data.message);
          setPending(false); 
          return;
        }
      } catch (error) {
        toast.error("Invalid transaction !");
        setPending(false); 
        return;
      }
    }
    // 2. Constructing payloads
    const salesRequest = {
      customer: {
        cid,
        cname: dueName, 
        phoneNumber,
        address,
        soldby,
        cardPay:walletAmount,
        vatAmount,
        received,
        username,
      },
      salesItems: productInfo,
    };

    const paymentRequest = {
      date,
      paymentName: dueName,
      paymentType: "payment",
      paymentNote: "Due Sale",
      amount: dueAmount,
      username,
    };

    setPending(true);
    try {
      // 3. Submit product sale
      const response = await fetch(`${apiBaseUrl}/sales/productSale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(salesRequest),
      });

      if (!response.ok) {
        toast.error("Product sale not submitted!");
        return;
      }

      // 4. Submit due payment record
      const response2 = await fetch(`${apiBaseUrl}/payment/paymentRecord`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentRequest),
      });

      if (!response2.ok) {
        toast.error("Due payment not recorded!");
        return;
      }

      // 5. Success actions
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
          label: item.productName + ", " + item.productno
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

  const [currency, setCurrency] = useState<string>('');
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getCurrency?username=${username}`)
      .then(response => response.json())
      .then(data => {
        if (data.currency === 'BDT' || !data.currency) {
          setCurrency('৳');
        } else {
          setCurrency(data.currency);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, [apiBaseUrl, username]);

  useEffect(() => {
    if (phoneNumber.trim().length === 11) {
      fetch(`${apiBaseUrl}/customer/customers?username=${username}&phoneNumber=${phoneNumber}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            setCname(data[0]?.customer || "");
            setAddress(data[0]?.address || "");

          } else {
            setCname("");
            setAddress("");
          }
        })
        .catch(error => {
          console.error("Error fetching customer info:", error);
          setCname("");
          setAddress("");
        });
    } else {
      setCname("");
      setAddress("");
    }
  }, [phoneNumber, apiBaseUrl, username]);

  const [paymentPersonOption, setPaymentPersonOption] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/payment/getPaymentPerson?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setPaymentPersonOption(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  const [walletPersonOption, setWalletPersonOption] = useState([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/payment/getWalletName?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setWalletPersonOption(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);

  return (
    <div className='container-2xl min-h-[calc(100vh-228px)]'>
      <div className="flex flex-col">
        <div className="flex pt-5 px-10 pb-0">
          <input type="date" name="date" onChange={(e: any) => setDate(e.target.value)}  max={maxDate} value={date} className="input input-ghost" />
        </div>
        <div className="flex flex-col w-full">
          <div className="divider divider-accent tracking-widest font-bold p-5">SALES AREA</div>
        </div>

        <div className="flex items-center gap-2 justify-center">
          <Select
            className="text-black w-64 md:w-96 z-10"
            ref={selectRef}
            autoFocus={true}
            value={selectedProidOption}
            options={productOption}

            onChange={async (selectedOption: any) => {
              if (!selectedOption) return;
              setSelectedProidOption(selectedOption);

              try {
                const response = await fetch(`${apiBaseUrl}/api/getSingleProduct?proId=${selectedOption.value}`);
                if (!response.ok) {
                  toast.error("Error fetching product data");
                  return;
                }
                const data = await response.json();
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
                setSelectedProidOption(null);
                if (selectRef.current) {
                  selectRef.current.focus();
                }
              } catch (error) {
                console.error('Error fetching product:', error);

              }
            }}
          />
          <div className="flex">
            <div className="avatar-group -space-x-6 rtl:space-x-reverse">
              <div className="avatar placeholder">
                <div className="bg-neutral text-neutral-content w-12">
                  <span>{totalQuantity}</span>
                </div>
              </div>
            </div>
          </div>
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
                  <th>DISCOUNT</th>
                  <th>(%) DISCOUNT</th>
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
                      <input
                        type="number"
                        name="sprice"
                        value={sprice[p.id] !== undefined ? sprice[p.id] : p.sprice}
                        onChange={(e) => dispatch(updateSprice({ id: p.id, sprice: parseFloat(e.target.value) || 0 }))}
                        className="bg-base-100 w-20 input input-xs input-bordered border-slate-700"
                      />
                    </td>

                    <td>
                      <input type="number" step="any" name="discount" value={p.discount} onChange={(e) => dispatch(updateDiscount({ id: p.id, discount: parseFloat(e.target.value) || 0 }))} className="bg-base-100 w-20 input input-xs input-bordered border-slate-700" />
                    </td>
                    <td>
                      <input type="number" name="percent" step="any" placeholder="0.00" onChange={(e) => {
                        const disPercent = parseFloat(e.target.value) || 0;
                        dispatch(updateDiscount({ id: p.id, discount: (p.sprice * disPercent) / 100 }));
                      }} className="bg-base-100 w-20 input input-xs input-bordered border-slate-700" />
                    </td>
                    <td>
                      <input type="number" name="offer" value={p.offer} onChange={(e) => dispatch(updateOffer({ id: p.id, offer: parseFloat(e.target.value) || 0 }))} className="bg-base-100 w-20 input input-xs input-bordered border-slate-700" />
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
                  <td className="text-lg font-semibold">{currency} {total.toLocaleString('en-IN')}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between">
        <div className="flex w-full justify-center p-5">
          <div className="card shadow shadow-slate-500 max-w-lg gap-3 p-2">
            <h1 className="font-bold text-sm">CUSTOMER INFO</h1>
            <div className="flex justify-end gap-2">
              <span className="label-text-alt">DUE</span>
              <input type="checkbox" className="checkbox checkbox-success w-[20px] h-[20px]" checked={due}
                onChange={(e) => setDue(e.target.checked)} />
            </div>

            {due && (
              <div className="flex flex-col gap-2">
                <span className="label-text-alt">DUE PERSON</span>
                <select className='select select-bordered w-[250px]' onChange={(e: any) => setDueName(e.target.value)}>
                  <option selected disabled>Select . . .</option>
                  {paymentPersonOption?.map((name: any, index) => (
                    <option key={index} value={name.paymentPerson}>
                      {name.paymentPerson}
                    </option>
                  ))}
                </select>
                <input type="number" name="due" className="input input-md input-bordered" value={dueAmount} onChange={(e: any) => setDueAmount(e.target.value)} placeholder="Due amount" />
              </div>
            )}
            {!due && (
              <div className="flex flex-col gap-2">
                <label className="input input-bordered flex items-center gap-2">
                  <FcManager size={20} />
                  <input type="text" name="customer" className="grow" value={cname} onChange={(e: any) => setCname(e.target.value)} placeholder="Customer Name" />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <FcPhone size={20} />
                  <input type="text" name="phone" className="grow" maxLength={11} onChange={(e: any) => setPhone(e.target.value.replace(/\D/g, ""))} value={phoneNumber} placeholder="Mobile Number" />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                  <FcViewDetails size={20} />
                  <input type="text" name="address" className="grow w-[100px]" onChange={(e: any) => setAddress(e.target.value)} value={address} placeholder="Address" />
                  |<input type="text" name="soldby" className="grow w-[100px]" onChange={(e: any) => setSoldby(e.target.value)} value={soldby} placeholder="Sold by" />
                </label>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full justify-center p-5">
          <div className="card shadow shadow-slate-500 max-w-lg gap-2 p-2">
            <h1 className="font-bold text-sm">PRICE INFO</h1>
            <label className="input input-bordered flex items-center gap-2">
              <HiOutlineReceiptTax size={20} />
              <span className="text-sm">VAT</span>
              <input type="number" className="grow w-[150px]" value={vatAmount.toFixed(2)} readOnly placeholder="Vat" />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <div className="text-lg">{currency}</div>
              <span className="text-sm">TOTAL</span>
              <input type="number" className="grow w-[150px]" value={(total + vatAmount).toFixed(2)} readOnly placeholder="Total" />
            </label>
            <select className='select select-bordered' onChange={(e: any) => { setWalletName(e.target.value) }}>
              <option selected disabled>Wallet . . .</option>
              {walletPersonOption?.map((name: any, index) => (
                <option key={index} value={name.walletName}>
                  {name.walletName} ({name.rate} %)
                </option>
              ))}
            </select>
            <label className="input input-bordered flex items-center gap-2">
              <div className="text-lg">{currency}</div>
              <input type="number" className="grow w-[150px]" value={walletAmount} onChange={(e) => setWalletAmount(e.target.value)} placeholder="Wallet Amount" />
            </label>

          </div>
        </div>
        <div className="flex w-full justify-center p-5">
          <div className="card shadow shadow-slate-500 max-w-lg gap-2 p-2">
            <h1 className="font-bold text-sm">PAYMENT INFO</h1>
            <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
              <div className="text-lg">{currency}</div>
              <input type="text" className="grow w-[150px]" value={Number((total + vatAmount).toFixed(2)).toLocaleString('en-IN')} placeholder="Total Amount" readOnly />
            </label>
            <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
              <FaHandHoldingMedical size={20} />
              <input type="number" className="grow w-[150px]" value={received} onChange={handleReceivedChange} placeholder="Received" />
            </label>
            <label className="input input-bordered flex w-full max-w-xs items-center gap-2">
              <RiHandCoinLine size={20} />
              <input type="text" className="grow w-[150px]" value={returnAmount.toFixed(2)} placeholder="Return" readOnly />
            </label>
          </div>
        </div>
        <div className="flex w-full justify-center p-2">
          <div className="card items-center justify-center gap-3 p-2">
            <h1 className="tracking-widest font-bold">SUBMIT</h1>
            <button onClick={due ? handleDueSubmit : handleFinalSubmit} disabled={pending} className="btn btn-success btn-circle font-bold">{pending ? <span className="loading loading-ring loading-md text-accent"></span> : <MdOutlineNavigateNext size={36} />}</button>
          </div>
        </div>
      </div>
      <ToastContainer autoClose={1000} theme="dark" />
    </div>
  )
}

export default Page