"use client"
import AdminChange from '@/app/components/AdminChange'
import BalanceSheet from '@/app/components/BalanceSheet'
import Currency from '@/app/components/Currency'
import InvoiceNote from '@/app/components/InvoiceNote'
import SaleReturn from '@/app/components/SaleReturn'
import ShopInfo from '@/app/components/ShopInfo'
import UserChange from '@/app/components/UserChange'
import VatInfo from '@/app/components/VatInfo'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

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
                <div
                    role="tablist"
                    className="tabs tabs-bordered w-full p-3 items-center justify-center"
                >
                    {/* Tab 1: Shop Info */}
                    <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        className="tab"
                        aria-label="ADDRESS SETTING"
                        defaultChecked
                    />
                    <div
                        role="tabpanel"
                        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
                    >
                        <ShopInfo />
                    </div>

                    {/* Tab 2: VAT Setting */}
                    <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        className="tab"
                        aria-label="VAT SETTING"
                    />
                    <div
                        role="tabpanel"
                        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
                    >
                        <VatInfo />
                    </div>
                    <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        className="tab"
                        aria-label="CURRENCY"
                    />
                    <div
                        role="tabpanel"
                        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
                    >
                        <Currency />
                    </div>

                    <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        className="tab"
                        aria-label="INVOICE NOTE"
                    />
                    <div
                        role="tabpanel"
                        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
                    >
                        <InvoiceNote />
                    </div>

                    {/* Tab 4: Sale Return */}
                    <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        className="tab"
                        aria-label="SALE RETURN"
                    />
                    <div
                        role="tabpanel"
                        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
                    >
                        <SaleReturn />
                    </div>

                    {/* Tab 5: Balance Sheet */}
                    <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        className="tab"
                        aria-label="BALANCE SHEET"
                    />
                    <div
                        role="tabpanel"
                        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
                    >
                        <BalanceSheet />
                    </div>
                    <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        className="tab"
                        aria-label="ADMIN CHANGE"
                    />
                    <div
                        role="tabpanel"
                        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
                    >
                        <AdminChange />
                    </div>
                    <input
                        type="radio"
                        name="my_tabs_2"
                        role="tab"
                        className="tab"
                        aria-label="USER CHANGE"
                    />
                    <div
                        role="tabpanel"
                        className="tab-content bg-base-100 border-base-300 rounded-box p-6"
                    >
                        <UserChange />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;
