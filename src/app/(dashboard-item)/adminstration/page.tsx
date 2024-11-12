import InvoiceNote from '@/app/components/InvoiceNote'
import ShopInfo from '@/app/components/ShopInfo'
import VatInfo from '@/app/components/VatInfo'
import React from 'react'

const page = () => {
  return (
    <div className="container min-h-screen">
      <div className="flex w-full items-center justify-center">
        <div role="tablist" className="tabs tabs-bordered p-3">
          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="ADDRESS SETTING" defaultChecked />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <ShopInfo />
          </div>

          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="VAT SETTING" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <VatInfo />
          </div>

          <input type="radio" name="my_tabs_2" role="tab" className="tab" aria-label="INVOICE NOTE" />
          <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <InvoiceNote />
          </div>
        </div>

      </div>
    </div>
  )
}

export default page