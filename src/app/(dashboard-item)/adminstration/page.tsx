"use client"
import AdminChange from '@/app/components/AdminChange'
import BalanceSheet from '@/app/components/BalanceSheet'
import InvoiceNote from '@/app/components/InvoiceNote'
import SaleReturn from '@/app/components/SaleReturn'
import ShopInfo from '@/app/components/ShopInfo'
import UserChange from '@/app/components/UserChange'
import VatInfo from '@/app/components/VatInfo'
import React, { useEffect, useState } from 'react'

interface Props {
    searchParams: { [key: string]: string | undefined };
}

const Page = ({ searchParams }: Props) => {
    
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (searchParams?.access === "granted") {
            setIsAuthorized(true);
        }
    }, [searchParams]);

    if (!isAuthorized) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center p-6 bg-red-100 border border-red-300 rounded-lg">
                    <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
                    <p className="mt-2 text-gray-700">
                        You do not have permission to access this page.
                    </p>
                    <a
                        href="/dashboard"
                        className="mt-4 inline-block px-4 py-2 bg-info text-white rounded hover:bg-blue-700"
                    >
                        Go Back to Dashboard
                    </a>
                </div>
            </div>
        );
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

                    {/* Tab 3: Invoice Note */}
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
