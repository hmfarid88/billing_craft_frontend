"use client"
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";

const SaleReturn = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);
    const [productno, setProductno] = useState("");

    const submitSaleReturn = async (e: any) => {
        e.preventDefault();
        if (!productno) {
            toast.warning("Product no is required");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/vatEntry`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productno, username }),
            });

            if (!response.ok) {
                toast.info("Sale is not returned !");
                return;
            } else {
                toast.success("Sale is returned successfully.")
                setProductno("");

            }
        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        } finally {
            setPending(false);
        }

    }
    return (

        <div className="flex items-center justify-center">
            <div className="flex flex-col gap-3">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">PRODUCT NO</span>
                    </div>
                    <input type="number" name="item" onChange={(e: any) => setProductno(e.target.value)} value={productno} placeholder="Type Here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <button onClick={submitSaleReturn} disabled={pending} className="btn btn-outline btn-success">{pending ? "Wait..." : "RETURN"}</button>
                </label>
            </div>

        </div>

    )
}

export default SaleReturn




