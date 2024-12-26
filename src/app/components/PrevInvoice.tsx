"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const PrevInvoice = () => {
   
    const router = useRouter();
    const [phoneNo, setPhoneNo] = useState("");
   
    const handleInvoice = (e: any) => {
        e.preventDefault();
        if (!phoneNo.trim()) {
            toast.warning("Mobile number required !");
            return;
        }
        router.push(`/invoice-list?phoneNumber=${phoneNo}`);
        setPhoneNo("");
    }
    return (
        <div className="flex flex-col gap-3 font-bold">
            <input type='text' value={phoneNo} className='input input-sm input-success w-[150px]' placeholder='Mobile No' onChange={(e: any) => setPhoneNo(e.target.value)} />
            <button onClick={handleInvoice} className='btn btn-sm btn-success w-[150px]'>PREV INVOICE </button>
        </div>
    )
}

export default PrevInvoice