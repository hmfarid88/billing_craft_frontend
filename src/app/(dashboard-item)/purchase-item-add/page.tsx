import BrandName from '@/app/components/BrandName'
import CategoryName from '@/app/components/CategoryName'
import ColorName from '@/app/components/ColorName'
import ProductName from '@/app/components/ProductName'
import SupplierName from '@/app/components/SupplierName'
import Link from 'next/link'
import React from 'react'
import { IoArrowBackCircle } from "react-icons/io5";

const page = () => {
    return (
        <div>
            <div className="flex justify-start items-start"><Link className='btn btn-circle btn-ghost text-info' href="/purchase"><IoArrowBackCircle size={36} /></Link> </div>
            <div className="flex flex-col items-center justify-center p-5">
                <h3 className="font-bold text-lg">ADD ITEM</h3>
                <CategoryName />
                <BrandName />
                <SupplierName />
                <ProductName />
                <ColorName />
            </div>
        </div>
    )
}

export default page