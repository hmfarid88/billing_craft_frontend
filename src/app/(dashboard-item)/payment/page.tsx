import Expense from '@/app/components/Expense'
import OfficeCost from '@/app/components/OfficeCost'
import ProfitWithdraw from '@/app/components/ProfitWithdraw'
import SupplierPayment from '@/app/components/SupplierPayment'
import { ToastContainer } from 'react-toastify'
import React from 'react'
import WalletPayment from '@/app/components/WalletPayment'


const page = () => {
  return (
    <div className='container-2xl min-h-screen'>
      <div className="flex-col md:flex-row w-full items-center justify-center">
        <div role="tablist" className="tabs tabs-bordered items-center justify-center">
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="EXPENSE" defaultChecked />
          <div role="tabpanel" className="tab-content p-10">
            <Expense />
          </div>
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="OFFICE PAYMENT" />
          <div role="tabpanel" className="tab-content p-10">
            <OfficeCost />
          </div>
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="SUPPLIER PAYMENT" />
          <div role="tabpanel" className="tab-content p-10">
            <SupplierPayment />
          </div>
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="WALLET PAYMENT" />
          <div role="tabpanel" className="tab-content p-10">
            <WalletPayment />
          </div>
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="PROFIT WITHDRAW" />
          <div role="tabpanel" className="tab-content p-10">
            <ProfitWithdraw />
          </div>
        </div>
        <ToastContainer theme='dark' autoClose={1000} />
      </div>
    </div>
  )
}

export default page