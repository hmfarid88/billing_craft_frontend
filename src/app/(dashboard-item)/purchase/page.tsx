import BrandName from "@/app/components/BrandName";
import CategoryName from "@/app/components/CategoryName";
import ColorName from "@/app/components/ColorName";
import ProductName from "@/app/components/ProductName";
import Purchase from "@/app/components/Purchase";
import SupplierName from "@/app/components/SupplierName";
import React from "react";
import { FcPlus } from "react-icons/fc";

const Page: React.FC = () => {
  return (
    <div className="container-2xl">
      <div className='card card-actions  p-5'>
        <div className="flex w-full justify-end">
          <div>
            <a href="#my_modal_1" className="btn btn-circle btn-ghost"><FcPlus size={35} /></a>
            <div className="modal sm:modal-middle" role="dialog" id="my_modal_1">
              <div className="modal-box">
                <h3 className="font-bold text-lg">ADD ITEM</h3>
                <CategoryName />
                <BrandName />
                <SupplierName />
                <ProductName />
                <ColorName />
                <div className="modal-action">
                  <a href="#" className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h1 className='text-lg font-bold'>PRODUCT PURCHASE</h1>
        <Purchase />
      </div>
    </div>
  )
}

export default Page