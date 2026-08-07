
'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import CurrentDate from "@/app/components/CurrentDate";
import { FcPrint } from "react-icons/fc";
import { useReactToPrint } from "react-to-print";
import { CgDetailsMore } from "react-icons/cg";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


interface Product {
    username: string;
    cashValue: number;
}

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const router = useRouter();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedUsername, setSelectedUsername] = useState('');
    const [maxDate, setMaxDate] = useState('');
    const [date, setDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);
        setDate(formattedDate);
    }, []);
    
    const handleCashbook = (e: any) => {
    e.preventDefault();

    if (!date) {
        toast.warning("Please, select any date!");
        return;
    }

    if (!selectedUsername) {
        toast.warning("Please, select a user!");
        return;
    }

    router.push(
        `/owner-cashbook?username=${encodeURIComponent(selectedUsername)}&date=${date}`
    );
};
    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    useEffect(() => {
        fetch(`${apiBaseUrl}/cashbook/groupCashSummary?username=${username}`)
            .then(res => res.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(err => console.error('Error fetching stock summary:', err));
    }, [apiBaseUrl, username]);

    useEffect(() => {
        const searchWords = filterCriteria.toLowerCase().split(" ");
        const filtered = allProducts.filter(product =>
            searchWords.every(word =>
                (product.username?.toLowerCase().includes(word) || '')

            )
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const totalValue = filteredProducts.reduce((total, product) => {
        return total + product?.cashValue;
    }, 0);
    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">
            <div className="flex flex-col p-5">
                <div className="flex justify-between items-center pl-5 pr-5 pt-5">
                    <label className="input input-bordered flex max-w-xs items-center gap-2">
                        <input type="text" value={filterCriteria} onChange={(e) => setFilterCriteria(e.target.value)} className="grow" placeholder="Search" />
                    </label>
                    <div className="flex items-center gap-3">
                        <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                    </div>
                </div>

                <div ref={contentToPrint} className="flex flex-col p-2 items-center justify-center">
                    <h4 className="font-bold">DAY BOOK</h4>
                    <h4 className="text-lg"><CurrentDate /></h4>
                    <div className="flex flex-col items-center justify-center">
                        <table className="table table-lg table-zebra">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>USER NAME</th>
                                    <th>CASH BALANCE</th>
                                    <th>DETAILS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts
                                    .filter(item => item.username !== username)
                                    .map((item, index) => (
                                        <tr key={item.username}>
                                            <td>{index + 1}</td>
                                            <td className="capitalize">{item.username}</td>
                                            <td>{item.cashValue.toLocaleString()}</td>
                                            <td>
                                                <a href="#day-book" className="btn btn-square btn-ghost"
                                                     onClick={() => setSelectedUsername(item.username)} >
                                                    <CgDetailsMore size={18} />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                            <tr className="font-bold text-sm">
                                <td></td>
                                <td>TOTAL</td>
                                <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>

                            </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div className="modal sm:modal-middle" role="dialog" id="day-book">
                <div className="modal-box">
                    <div className="flex flex-col w-full">
                        <div className="divider divider-accent tracking-widest font-bold text-sm p-2">DAY BOOK</div>
                    </div>
                    <div className="flex flex-col w-full items-center justify-center gap-10">
                        <input type='date' className='input input-success w-full max-w-xs' value={date} onChange={(e: any) => setDate(e.target.value)} max={maxDate} />
                        <button onClick={handleCashbook} className='btn btn-success w-full max-w-xs'> VIEW </button>
                    </div>

                    <div className="modal-action">
                        <a href="#" className="btn btn-square btn-ghost">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-10 h-10">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;

