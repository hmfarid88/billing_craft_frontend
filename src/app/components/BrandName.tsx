"use client"
import React, { useState } from 'react'
import { useAppSelector } from '../store';
import { toast } from 'react-toastify';
import revalidate from '../revalidate';

const BrandName = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [brandItem, setBrandName] = useState("");
    const handleBrandAdd = async (e: any) => {
        e.preventDefault();
        if (!brandItem) {
            toast.error("Brand name is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addNewBrand`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ brandItem, username }),
            });

            if (response.ok) {
                setBrandName("");
                toast.success("Brand added successfully !");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Invalid Brand name !")
        } finally {
            setPending(false)
        }
    };
    return (
        <div className="flex w-full items-center justify-center p-2">
            <label className="form-control w-full max-w-xs">
                <div className="label">
                    <span className="label-text-alt">ADD BRAND</span>
                </div>
                <div className="flex items-center justify-between">
                    <input type="text" value={brandItem} name="colorItem" onChange={(e: any) => setBrandName(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" />
                    <button onClick={handleBrandAdd} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                </div>
            </label>
        </div>
    )
}

export default BrandName