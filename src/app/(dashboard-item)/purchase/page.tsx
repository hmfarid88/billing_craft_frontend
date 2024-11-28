
import Purchase from "@/app/components/Purchase";
import Link from "next/link";
import React from "react";
import { FcPlus } from "react-icons/fc";

const Page: React.FC = () => {
  return (
    <div className="container-2xl">
      <div className='card card-actions  p-5'>
        <div className="flex w-full justify-end">
          <div>
            <Link className="btn btn-circle btn-ghost" href="/purchase-item-add"><FcPlus size={35} /></Link>
           
          </div>
        </div>

        <h1 className='text-lg font-bold'>PRODUCT PURCHASE</h1>
        <Purchase />
      </div>
    </div>
  )
}

export default Page