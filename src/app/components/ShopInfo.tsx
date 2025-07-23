"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";

const ShopInfo = () => {
    interface shopData {
        shopName?: string,
        phoneNumber?: string,
        address?: string,
        email?: string
    }
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);

    const submitShopInfo = async (e: any) => {
        e.preventDefault();
        const { shopName, phoneNumber, address, email } = shopInfo || {};

        if (!shopName || !phoneNumber || !address || !email) {
            toast.warning("All fields are required");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/shop/addShopInfo`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shopName, phoneNumber, address, email, username }),
            });

            if (!response.ok) {
                toast.error("Shop info not submitted !");
                return;
            } else {
                toast.success("Info added successfully.")

            }
        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        } finally {
            setPending(false);
        }

    }

    const [shopInfo, setShopInfo] = useState<shopData>();
    useEffect(() => {
        fetch(`${apiBaseUrl}/shop/getShopInfo?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setShopInfo(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);
    return (

        <div className="flex items-center justify-center">

            <div className="flex flex-col gap-3">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">SHOP NAME</span>
                    </div>
                    <input type="text" name="name" onChange={(e) => setShopInfo({ ...shopInfo, shopName: e.target.value })} value={shopInfo?.shopName} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">PHONE NUMBER</span>
                    </div>
                    <input type="text" name="phone" onChange={(e) => setShopInfo({ ...shopInfo, phoneNumber: e.target.value })} value={shopInfo?.phoneNumber} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">ADDRESS</span>
                    </div>
                    <input type="text" name="address" onChange={(e) => setShopInfo({ ...shopInfo, address: e.target.value })} value={shopInfo?.address} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">EMAIL</span>
                    </div>
                    <input type="text" name="email" onChange={(e) => setShopInfo({ ...shopInfo, email: e.target.value })} value={shopInfo?.email} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <button onClick={submitShopInfo} disabled={pending} className="btn btn-outline btn-success">{pending ? "Submitting..." : "SUBMIT"}</button>
                </label>
            </div>

        </div>

    )
}

export default ShopInfo