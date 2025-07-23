"use client"
import AdminChange from '@/app/components/AdminChange'
import BalanceSheet from '@/app/components/BalanceSheet'
import Currency from '@/app/components/Currency'
import DiscountHide from '@/app/components/DiscountHide'
import ExpenseEdit from '@/app/components/ExpenseEdit'
import InvoiceNote from '@/app/components/InvoiceNote'
import OfficePayEdit from '@/app/components/OfficePayEdit'
import ProductEdit from '@/app/components/ProductEdit'
import PurchaseReturn from '@/app/components/PurchaseReturn'
import SaleReturn from '@/app/components/SaleReturn'
import ShopInfo from '@/app/components/ShopInfo'
import SmsSetting from '@/app/components/SmsSetting'
import SupplierPayEdit from '@/app/components/SupplierPayEdit'
import UserChange from '@/app/components/UserChange'
import VatInfo from '@/app/components/VatInfo'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { CgEditExposure } from 'react-icons/cg'
import { FaBalanceScale } from 'react-icons/fa'
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlinePassword } from 'react-icons/md'
import { TbTruckReturn } from 'react-icons/tb'

const Page = () => {

    const searchParams = useSearchParams();
    const access = searchParams.get('access');
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        setIsAuthorized(access === "granted");
    }, [access]);

    if (!isAuthorized) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-228px)]">
                <p className='text-red-500 uppercase font-semibold'>Unauthorized access !!!</p>
            </div>
        )
    }

    return (
        <div className="container min-h-screen">
            <div className="flex w-full items-center justify-center">
                <div className="tabs tabs-bordered w-full p-3 items-center justify-center">
                    {/* Tab 1: SETTINGS */}
                    <input type="radio" id="settings-tab" name="my_tabs_2" className="hidden peer/settings" defaultChecked />
                    <label htmlFor="settings-tab" className="tab flex items-center gap-2 cursor-pointer">
                        <IoSettingsOutline size={20} /> SETTINGS
                    </label>
                    <div className="hidden peer-checked/settings:block tab-content bg-base-100 border p-6 rounded-box">
                        <div className="flex flex-col gap-3">
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">SHOP ADDRESS</div>
                                <div className="collapse-content">
                                    <ShopInfo />
                                </div>
                            </div>
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">VAT SETTING</div>
                                <div className="collapse-content">
                                    <VatInfo />
                                </div>
                            </div>
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">CURRENCY SETTING</div>
                                <div className="collapse-content">
                                    <Currency />
                                </div>
                            </div>
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">INVOICE SETTING</div>
                                <div className="collapse-content">
                                    <InvoiceNote />
                                </div>
                            </div>
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">SMS SETTING</div>
                                <div className="collapse-content">
                                    <SmsSetting />
                                </div>
                            </div>
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">DISCOUNT SETTING</div>
                                <div className="collapse-content">
                                    <DiscountHide />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab 2: RETURN */}
                    <input type="radio" id="return-tab" name="my_tabs_2" className="hidden peer/return" />
                    <label htmlFor="return-tab" className="tab flex items-center gap-2 cursor-pointer">
                        <TbTruckReturn size={20} /> RETURN
                    </label>
                    <div className="hidden peer-checked/return:block tab-content bg-base-100 border p-6 rounded-box">
                        <div className="flex flex-col gap-3">
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">PURCHASE RETURN</div>
                                <div className="collapse-content">
                                    <PurchaseReturn />
                                </div>
                            </div>
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">SALE RETURN</div>
                                <div className="collapse-content">
                                    <SaleReturn />
                                </div>
                            </div>
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">PRODUCT EDIT</div>
                                <div className="collapse-content">
                                    <ProductEdit />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tab 3: BALANCE SHEET */}
                    <input type="radio" id="balance-tab" name="my_tabs_2" className="hidden peer/balance" />
                    <label htmlFor="balance-tab" className="tab flex items-center gap-2 cursor-pointer">
                        <FaBalanceScale size={20} /> BALANCE SHEET
                    </label>
                    <div className="hidden peer-checked/balance:block tab-content bg-base-100 border p-6 rounded-box">
                        <div className="flex gap-3">
                            <BalanceSheet />
                        </div>
                    </div>

                    {/* Tab 4: PASSWORD */}
                    <input type="radio" id="password-tab" name="my_tabs_2" className="hidden peer/password" />
                    <label htmlFor="password-tab" className="tab flex items-center gap-2 cursor-pointer">
                        <MdOutlinePassword size={20} /> PASSWORD
                    </label>
                    <div className="hidden peer-checked/password:block tab-content bg-base-100 border p-6 rounded-box">
                        <div className="flex flex-col gap-3">
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">ADMIN PASSWORD</div>
                                <div className="collapse-content">
                                    <AdminChange />
                                </div>
                            </div>
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">USER PASSWORD</div>
                                <div className="collapse-content">
                                    <UserChange />
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="radio" id="payment-tab" name="my_tabs_2" className="hidden peer/payment" />
                    <label htmlFor="payment-tab" className="tab flex items-center gap-2 cursor-pointer">
                        <CgEditExposure size={20} /> PAYMENT
                    </label>
                    <div className="hidden peer-checked/payment:block tab-content bg-base-100 border p-6 rounded-box">
                        <div className="flex flex-col gap-3">
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">EXPENSE</div>
                                <div className="collapse-content">
                                    <ExpenseEdit />
                                </div>
                            </div>
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">OFFICE PAYMENT</div>
                                <div className="collapse-content">
                                    <OfficePayEdit />
                                </div>
                            </div>
                            <div className="collapse collapse-arrow bg-base-200">
                                {/* <input type="radio" name="my-accordion-2" /> */}
                                <input type="checkbox" className="peer" />
                                <div className="collapse-title text-sm font-medium">SUPPLIER PAYMENT</div>
                                <div className="collapse-content">
                                    <SupplierPayEdit />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
