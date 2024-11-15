"use client"
import React, { useRef, useEffect, useState } from 'react'
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from 'react-to-print';
import { FcPrint, FcPlus, FcDataSheet, FcAdvertising } from "react-icons/fc";
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
        saleType: string,
        color: string,
        date: string,
        time: string,
        pprice: number,
        sprice: number,
        discount: number,
        offer: number,
        cardAmount: number,
        vatAmount: number,
        received: number,
        cid: string
    }
    interface shopData {
        shopName: string,
        phoneNumber: string,
        address: string,
        email: string
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

    const [allNotes, setAllNotes] = useState([]);
    useEffect(() => {

        fetch(`${apiBaseUrl}/shop/getInvoiceNote?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllNotes(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);

    useEffect(() => {
        if (username && cid) {
            fetch(`${apiBaseUrl}/api/getInvoiceData?username=${username}&cid=${cid}`)
                .then(response => response.json())
                .then(data => {
                    console.log('Fetched invoice data:', data);
                    // Update sprice to be pprice if saleType is 'vendor'
                    const updatedData = data.map((item: invoiceData) => {
                        if (item.saleType === 'vendor') {
                            return { ...item, sprice: item.pprice };
                        }
                        return item;
                    });
                    setInvoiceData(updatedData);
                })
                .catch(error => console.error('Error fetching invoice data:', error));
        }
    }, [apiBaseUrl, username, cid]);
    const isVendorSale = invoiceData.some(item => item.saleType === 'vendor');
    const saleLink = isVendorSale ? "/vendor-sale" : "/sale";

    if (!invoiceData) {
        return <div><Loading /></div>;
    }

    const subtotal = invoiceData.reduce((acc, item) => acc + item.sprice, 0);
    const discount = invoiceData.reduce((acc, item) => acc + item.discount, 0);
    const offer = invoiceData.reduce((acc, item) => acc + item.offer, 0);
    const vat = invoiceData.reduce((acc, item) => item.vatAmount, 0);
    const card = invoiceData.reduce((acc, item) => item.cardAmount, 0);
    const received = invoiceData.reduce((acc, item) => item.received, 0);
    return (
        <div className="container min-h-[calc(100vh-228px)]">
            <div className="flex justify-end pr-10 pt-5 gap-3">
                <Link href={saleLink}>  <button className='btn btn-ghost btn-square'><FcPlus size={36} /></button></Link>
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>
            <div className="flex justify-center mb-5">
                <div ref={contentToPrint} className="flex-1 max-w-[794px] h-auto p-5 border">
                    <div className="flex w-full justify-between">
                        <h1><FcDataSheet size={50} /></h1>
                        <h1 className='tracking-widest font-bold text-sm md:text-lg'>INVOICE</h1>
                    </div>
                    <div className="flex flex-col w-full justify-end items-end">
                        <h1 className='uppercase font-bold text-sm md:text-md'>{shopInfo?.shopName}</h1>
                        <h4 className='flex font-sans text-xs md:text-md'><IoLocationOutline className='mt-0.5 mr-1' /> {shopInfo?.address}</h4>
                        <h4 className='flex font-sans text-xs md:text-md'><FaPhoneVolume className='mt-0.5 mr-1' /> {shopInfo?.phoneNumber}</h4>
                        <h4 className='flex font-sans text-xs md:text-md'><AiOutlineMail className='mt-0.5 mr-1' /> {shopInfo?.email}</h4>
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="divider divider-accent tracking-widest text-xs font-semibold mt-0 mb-1">INFORMATION</div>
                    </div>
                    <div className="flex w-full justify-between">
                        <div className="flex flex-col">
                            <h2 className='uppercase font-bold text-xs md:text-md'>{invoiceData[0]?.cname}</h2>
                            <h4 className='flex text-xs md:text-md pt-1'>{invoiceData[0]?.phoneNumber}</h4>
                            <h4 className='capitalize text-xs md:text-md pt-1'>{invoiceData[0]?.address}</h4>
                        </div>
                        <div className="flex flex-col items-end">
                            <h4 className='font-semibold text-xs md:text-md uppercase'>Invoice No : {invoiceData[0]?.cid}</h4>
                            <h4 className='font-semibold text-xs md:text-md uppercase pt-1'>Date : {invoiceData[0]?.date.toLocaleString()}</h4>
                            <h4 className='font-semibold text-xs md:text-md uppercase pt-1'>Time : {invoiceData[0]?.time.toLocaleString()}</h4>
                        </div>
                    </div>
                    <div className="w-full pt-2">
                        <table className="table table-sm">
                            <thead>
                                <tr className='border-b-base-content text-xs md:text-md font-bold'>
                                    <th className='text-left p-0'>PRODUCT</th>
                                    <th>QTY</th>
                                    <th>PRICE</th>
                                    <th className='text-right p-0'>TOTAL</th>
                                </tr>
                            </thead>
                            <tbody className='text-xs md:text-md capitalize'>
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
                            <p className='font-semibold text-xs md:text-md'>{subtotal?.toLocaleString('en-IN')}</p>
                            <p className='font-semibold text-xs md:text-md'>{discount?.toLocaleString('en-IN')}</p>
                            <p className='font-semibold text-xs md:text-md'>{offer?.toLocaleString('en-IN')}</p>
                            <p className='font-semibold text-xs md:text-md'>{vat?.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <div className="flex w-full justify-between">
                        <div className="font-semibold tracking-widest text-xs mt-1 mb-0">SIGNATURE -------------</div>
                        <div className="mt-0 mb-0">----------------------</div>
                    </div>
                    <div className="flex w-full justify-end">
                        <div className="flex w-1/2 gap-5 justify-end">
                            <div className="flex flex-col items-end">
                                <p className='uppercase font-semibold text-xs md:text-md'>TOTAL :</p>
                                <p className='uppercase font-semibold text-xs md:text-md'>CARD PAY :</p>
                                <p className='uppercase font-semibold text-xs md:text-md'>RECEIVED :</p>
                                {received ? (
                                    <p className='uppercase font-semibold text-xs md:text-md'>RETURNED :</p>
                                ) : null}
                            </div>
                            <div className="flex flex-col items-end">
                                <p className='font-semibold text-xs md:text-md'>{((subtotal + vat) - discount - offer).toLocaleString('en-IN')}</p>
                                <p className='font-semibold text-xs md:text-md'>{card?.toLocaleString('en-IN')}</p>
                                <p className='font-semibold text-xs md:text-md'>{received?.toLocaleString('en-IN')}</p>
                                {received ? (
                                    <p className='font-semibold text-xs md:text-md'>{(received-((subtotal + vat) - discount - offer- card)).toLocaleString('en-IN')}</p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col pt-5 capitalize">
                        {allNotes?.map((item: any, index) => (
                            <tr key={index}>
                                <td><p className='flex gap-2 text-left'> <FcAdvertising size={20} /> {item.note}</p></td>

                            </tr>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Invoice