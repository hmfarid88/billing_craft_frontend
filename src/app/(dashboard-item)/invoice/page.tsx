"use client"
import React, { useRef, useEffect, useState } from 'react'
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from 'react-to-print';
import { FcPrint, FcPlus, FcDataSheet, FcSpeaker } from "react-icons/fc";
import Link from 'next/link';
import Loading from '@/app/loading';
import { useSearchParams } from 'next/navigation';
import { IoLocationOutline } from 'react-icons/io5';
import { FaPhoneVolume } from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';

const Invoice = () => {
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const searchParams = useSearchParams();
    const cid = searchParams.get('cid');
    const [invoiceData, setInvoiceData] = useState<invoiceData[]>([]);

    interface invoiceData {
        cname: string,
        phoneNumber: string,
        address: string,
        brand: string,
        productName: string,
        productno: string,
        saleType:string,
        color: string,
        saleDate: string,
        pprice:number,
        sprice: number,
        discount: number,
        offer: number,
        cardAmount: number,
        vatAmount: number,
        dueAmount: number,
        cid: string
    }
    interface shopData{
        shopName:string,
        phoneNumber:string,
        address:string,
        email:string
    }
    const [shopInfo, setShopInfo] = useState<shopData>();
    useEffect(() => {
        fetch(`${apiBaseUrl}/shop/getShopInfo?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setShopInfo(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    useEffect(() => {
        if (username && cid) {
            fetch(`${apiBaseUrl}/api/getInvoiceData?username=${username}&cid=${cid}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched invoice data:', data);
                    setInvoiceData(data);
                })
                .catch(error => console.error('Error fetching invoice data:', error));
        }
    }, [apiBaseUrl, username, cid]);


    if (!invoiceData) {
        return <div><Loading /></div>;
    }
    if(invoiceData[0].saleType==='vendor'){
        invoiceData[0].sprice=invoiceData[0].pprice
    }
    const subtotal = invoiceData.reduce((acc, item) => acc + item.sprice, 0);
    const discount = invoiceData.reduce((acc, item) => acc + item.discount, 0);
    const offer = invoiceData.reduce((acc, item) => acc + item.offer, 0);
    const vat = invoiceData.reduce((acc, item) => item.vatAmount, 0);
    const card = invoiceData.reduce((acc, item) => item.cardAmount, 0);
    const due = invoiceData.reduce((acc, item) => item.dueAmount, 0);
    return (
        <div className="container min-h-[calc(100vh-228px)]">
            <div className="flex justify-end pr-10 pt-5 gap-3">
                <Link href="/sale">  <button className='btn btn-ghost btn-square'><FcPlus size={36} /></button></Link>
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>
            <div className="flex justify-center mb-5">
                <div ref={contentToPrint} className="flex-1 max-w-[794px] h-auto p-5 sm:p-10 border">
                    <div className="flex w-full justify-between">
                        <h1><FcDataSheet size={50} /></h1>
                        <h1 className='tracking-widest font-bold text-sm md:text-lg'>INVOICE</h1>
                    </div>
                    <div className="flex flex-col w-full justify-end items-end">
                            <h1 className='uppercase font-bold text-sm md:text-md'>{shopInfo?.shopName}</h1>
                            <h4 className='flex font-sans text-xs md:text-md'><IoLocationOutline className='mt-0.5 mr-1'/> {shopInfo?.address}</h4>
                            <h4 className='flex font-sans text-xs md:text-md'><FaPhoneVolume className='mt-0.5 mr-1' /> {shopInfo?.phoneNumber}</h4>
                            <h4 className='flex font-sans text-xs md:text-md'><AiOutlineMail className='mt-0.5 mr-1'/> {shopInfo?.email}</h4>
                        </div>
                    <div className="flex flex-col w-full">
                        <div className="divider divider-accent tracking-widest text-xs font-semibold mt-0 mb-1">INFORMATION</div>
                    </div>
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col">
                            <h2 className='uppercase font-bold text-xs md:text-md'>{invoiceData[0]?.cname}</h2>
                            <h4 className='flex text-xs md:text-md pt-1'>{invoiceData[0]?.phoneNumber}</h4>
                            <h4 className='uppercase text-xs md:text-md pt-1'>{invoiceData[0]?.address}</h4>
                        </div>
                        <div className="flex flex-col items-end">
                            <h4 className='font-semibold text-xs md:text-md uppercase'>Invoice Number : {invoiceData[0]?.cid}</h4>
                            <h4 className='font-semibold text-xs md:text-md uppercase pt-1'>Date : {invoiceData[0]?.saleDate.toLocaleString()}</h4>
                        </div>
                    </div>
                    <div className="w-full pt-2">
                        <table className="table">
                            <thead>
                                <tr className='border-b-base-content text-xs md:text-md font-bold'>
                                    <th className='text-left p-0'>PRODUCT</th>
                                    <th>QTY</th>
                                    <th>PRICE</th>
                                    <th className='text-right p-0'>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody className='text-xs md:text-md uppercase'>
                                {invoiceData?.map((products, index) => (
                                    <tr key={index}>
                                        <td className='text-left p-0'>{products.brand} {products.productName} {products.color} {products.productno}</td>
                                        <th>1</th>
                                        <td>{products.sprice.toLocaleString('en-IN')}</td>
                                        <td className='text-right p-0'>{products.sprice.toLocaleString('en-IN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="divider mt-0 mb-0"></div>
                    </div>
                    <div className="flex w-full gap-5 justify-end">
                        <div className="flex flex-col items-end">
                            <p className='uppercase font-semibold text-xs md:text-md'>SUB TOTAL :</p>
                            <p className='uppercase font-semibold text-xs md:text-md'>DISCOUNT :</p>
                            <p className='uppercase font-semibold text-xs md:text-md'>OFFER :</p>
                            <p className='uppercase font-semibold text-xs md:text-md'>VAT :</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className='font-semibold text-xs md:text-md'>{subtotal.toLocaleString('en-IN')}</p>
                            <p className='font-semibold text-xs md:text-md'>{discount.toLocaleString('en-IN')}</p>
                            <p className='font-semibold text-xs md:text-md'>{offer.toLocaleString('en-IN')}</p>
                            <p className='font-semibold text-xs md:text-md'>{vat.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <div className="flex flex-col w-full items-end">
                        <div className="mt-0 mb-0">----------------------</div>
                    </div>
                    <div className="flex w-full justify-between">
                    <div className="flex flex-col w-1/2 justify-start">
                        <div className="font-semibold tracking-widest text-xs mb-0">SIGNATURE ---------------</div>
                    </div>
                    <div className="flex w-1/2 gap-5 justify-end">
                        <div className="flex flex-col items-end">
                            <p className='uppercase font-semibold text-xs md:text-md'>TOTAL :</p>
                            <p className='uppercase font-semibold text-xs md:text-md'>CASH PAYMENT :</p>
                            <p className='uppercase font-semibold text-xs md:text-md'>CARD PAYMENT :</p>
                            <p className='uppercase font-semibold text-xs md:text-md'>DUE AMOUNT :</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className='font-semibold text-xs md:text-md'>{((subtotal + vat) - discount - offer).toLocaleString('en-IN')}</p>
                            <p className='font-semibold text-xs md:text-md'>{((subtotal + vat) - discount - offer - card - due).toLocaleString('en-IN')}</p>
                            <p className='font-semibold text-xs md:text-md'>{card.toLocaleString('en-IN')}</p>
                            <p className='font-semibold text-xs md:text-md'>{due.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    
                    </div>
                    <div className="flex pt-5">
                        <FcSpeaker size={30} />
                        <p className='font-semibold font-serif text-xs pt-2 px-1'>বিক্রিত পণ্য ফেরতযোগ্য নয়। বৈধ ওয়ারেন্টি পরিষেবার জন্য গ্রাহককে ওয়ারেন্টি কেন্দ্রে যেতে হবে।</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Invoice