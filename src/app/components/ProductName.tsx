"use client"
import React, { useState } from 'react'
import { useAppSelector } from "@/app/store";
import { toast } from 'react-toastify';
const ProductName = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [productItem, setProductItem] = useState("");

    const handleProductitem = async (e: any) => {
        e.preventDefault();
        if (!productItem) {
            toast.error("Item is empty !")
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/addNewProduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({productItem, username}),
            });

            if (response.ok) {
                setProductItem("");
                toast.success("Item added successfully !");
            } else {
                const data = await response.json();
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Invalid product name !")
        }finally{
            setPending(false)
        }

    };
    return (
        <div className="flex w-full items-center justify-center p-2">
                  <label className="form-control w-full max-w-xs">
                    <div className="label">
                      <span className="label-text-alt">ADD PRODUCT</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <input type="text" value={productItem} name="productItem" onChange={(e: any) => setProductItem(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" required />
                      <button onClick={handleProductitem} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
                    </div>
                  </label>
                </div>
    )
}

export default ProductName