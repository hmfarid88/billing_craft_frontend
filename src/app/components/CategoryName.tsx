"use client"
import React, { useState } from 'react'
import { useAppSelector } from '../store';
import { toast } from 'react-toastify';
const CategoryName = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [pending, setPending] = useState(false);
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [categoryItem, setCategoryItem] = useState("");
    const handleCategoryItem = async (e: any) => {
        e.preventDefault();
        if (!categoryItem) {
                toast.error("Item is empty !")
                return;
        }
        setPending(true);
          try {
            const response = await fetch(`${apiBaseUrl}/api/addNewCategory`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({categoryItem, username}),
            });
    
            if (response.ok) {
              setCategoryItem("");
              toast.success("Item added successfully !");
            } else {
              const data = await response.json();
              toast.error(data.message);
            }
          } catch (error) {
            toast.error("Invalid category name !")
          }finally{
            setPending(false)
          }
         };
  return (
    <div className="flex w-full items-center justify-center p-2">
    <label className="form-control w-full max-w-xs">
      <div className="label">
        <span className="label-text-alt">ADD CATEGORY</span>
      </div>
      <div className="flex items-center justify-between">
        <input type="text" value={categoryItem} name="colorItem" onChange={(e: any) => setCategoryItem(e.target.value)} placeholder="Type here" className="input input-bordered w-3/4 max-w-xs" />
        <button onClick={handleCategoryItem} disabled={pending} className="btn btn-square btn-success">{pending ? "Adding..." : "ADD"}</button>
      </div>
    </label>
  </div>
  )
}

export default CategoryName