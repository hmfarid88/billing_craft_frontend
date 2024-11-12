import Expense from '@/app/components/Expense'
import OfficeCost from '@/app/components/OfficeCost'
import SupplierPayment from '@/app/components/SupplierPayment'
import React from 'react'

const page = () => {
  return (
    <div className='container-2xl min-h-screen'>
    <div className="flex w-full items-center justify-center">
      <div role="tablist" className="tabs tabs-bordered">
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
      </div>
    </div>
  </div>
  )
}

export default page