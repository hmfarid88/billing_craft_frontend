"use client"
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

const SaleInfoEdit = () => {

    const router = useRouter();
    const [pending, setPending] = useState(false);
    const [cid, setCid] = useState("");

    const handleInvoiceEdit = () => {
        if (!cid) {
            toast.info("Invoice No Required!")
            return;
        }
        router.push(`/sale-info-edit?cid=${cid.trim()}`);

    }

    return (

        <div className="flex items-center justify-center">
            <div className="flex flex-col gap-3">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">INVOICE NO</span>
                    </div>
                    <input type="text" name="cid" onChange={(e: any) => setCid(e.target.value)} value={cid} placeholder="Type Here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <button onClick={handleInvoiceEdit} disabled={pending} className="btn btn-outline btn-success">{pending ? "Wait..." : "NEXT"}</button>
                </label>
            </div>

        </div>

    )
}

export default SaleInfoEdit




