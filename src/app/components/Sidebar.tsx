import React from 'react'
import Link from 'next/link'
import { IoHomeOutline } from 'react-icons/io5';
import { MdOutlineInterests, MdOutlinePayments } from 'react-icons/md';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { RiSecurePaymentLine } from 'react-icons/ri';
import { GoDatabase } from 'react-icons/go';
import { TbReportSearch } from 'react-icons/tb';
import { PiNotebook } from 'react-icons/pi';
import { VscRepo } from 'react-icons/vsc';
import { GrUserAdmin } from 'react-icons/gr';
import { BsDatabaseAdd } from 'react-icons/bs';
import CashBook from './CashBook';

export const Sidebar = () => {
    return (
        <div className="drawer lg:drawer-open z-50">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">

                <div className="flex-none lg:hidden">
                    <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    </label>
                </div>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-60 min-h-full bg-base-200 text-base-content">
                    <li><Link href="/dashboard"><IoHomeOutline size={20} /> HOME</Link></li>
                    <li><Link href="/purchase"><BsDatabaseAdd size={20} />PRODUCT ENTRY</Link></li>
                    <li>
                        <details>
                            <summary><HiOutlineShoppingBag size={20} />PRODUCT SALE</summary>
                            <ul>
                                <li><Link href="/sale">CUSTOMER SALE</Link></li>
                                <li><Link href="/vendor-sale">VENDOR SALE</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li><Link href="/payment"><RiSecurePaymentLine size={20} /> PAYMENT ENTRY</Link></li>
                       
                    <li><Link href="/stockreport"><GoDatabase size={20} /> STOCK REPORT</Link></li>
                    <li>
                        <details>
                            <summary><TbReportSearch size={20} /> SALE REPORT</summary>
                            <ul>
                                <li><Link href="/salereport">CUSTOMER SALE</Link></li>
                                <li><Link href="/salereport">VENDOR SALE</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary><MdOutlinePayments size={20} /> PAYMENT REPORT</summary>
                            <ul>
                                <li><a><Link href="/paymentreport"> PAYMENT REPORT</Link></a></li>
                                <li><a><Link href="/paymentreport"> RECEIVE REPORT</Link></a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary><PiNotebook size={20} /> LEDGER BOOK</summary>
                            <ul>
                                <li><a><Link href="/supplier-ledger">SUPPLIER LEDGER</Link></a></li>
                                <li><a><Link href="/stock-ledger">RETAILER LEDGER</Link></a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary><a className='flex gap-2'><VscRepo size={20} /> CASH BOOK </a></summary>
                            <ul>
                                <li>
                                    <CashBook />
                                </li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary><a className='flex gap-2'><PiNotebook size={20} />FIND INVOICE </a></summary>
                            <ul>
                                <li>
                                    {/* <Invoice /> */}
                                </li>
                            </ul>
                        </details>
                    </li>
                    <li><Link href="/profitloss"><MdOutlineInterests size={20} /> PROFIT / LOSS</Link></li>
                    <li><Link href="/adminstration"><GrUserAdmin size={20} /> ADMINSTRATION</Link></li>



                </ul>

            </div>
        </div>
    )
}

export default Sidebar