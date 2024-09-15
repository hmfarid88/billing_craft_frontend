"use client"
import React, { useState } from 'react'
import { DatePicker } from 'react-date-picker';
import { toast} from "react-toastify";
import { FcCalendar } from "react-icons/fc";
import { useAppSelector } from "@/app/store";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const OfficeCost = () => {
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const [pending, setPending] = useState(false);
  const [date, setDate] = useState<Value>(new Date());
  const [paymentName, setPaymentName] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");

  const handlePaymentSubmit = async (e: any) => {
    e.preventDefault();
    if (!paymentName || !paymentType || !paymentAmount) {
      toast.warning("Item is empty !");
      return;
    }
    setPending(true);
    try {
      const response = await fetch(`${apiBaseUrl}/payment/paymentRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, paymentName, paymentType, amount: paymentAmount, username }),
      });

      if (response.ok) {
        toast.success("Payment added successfully !");
      } else {
        const data = await response.json();
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Invalid transaction !")
    } finally {
      setPending(false);
      setPaymentName("");
      setPaymentAmount("");
    }
  };
  return (
    <div>
       <p>DATE : <DatePicker calendarIcon={FcCalendar} className="rounded-md max-w-xs z-20" clearIcon={null} maxDate={new Date()} format='y-MM-dd' onChange={setDate} value={date} /></p>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Payment Name</span>
                </div>
                <input type="text" value={paymentName} onChange={(e) => setPaymentName(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Payment Type</span>
                </div>
                <select className='select select-bordered'  onChange={(e:any)=>{setPaymentType(e.target.value)}}>
                <option selected disabled>Select . . .</option>
                    <option value="Payment">PAYMENT</option>
                    <option value="Receive">RECEIVE</option>
                </select> 
                </label>
            </div>
            <div className="flex">
              <label className="form-control w-full max-w-xs">
                <div className="label">
                  <span className="label-text">Payment Amount</span>
                </div>
                <input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
              </label>
            </div>
            <div className="flex pt-5">
              <label className="form-control w-full max-w-xs">
                <button onClick={handlePaymentSubmit} className="btn btn-success btn-outline max-w-xs" disabled={pending} >{pending ? "Submitting..." : "SUBMIT"}</button>
              </label>
            </div>
    </div>
  )
}

export default OfficeCost