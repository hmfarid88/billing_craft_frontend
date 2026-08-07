
'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import CurrentDate from "@/app/components/CurrentDate";
import { FcPrint, FcAutomatic } from "react-icons/fc";
import { useReactToPrint } from "react-to-print";
import { CgDetailsMore } from "react-icons/cg";
import { useRouter } from "next/navigation";


interface Product {
    username: string;
    stockQty: number;
    stockValue: number;
}

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const router = useRouter();
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const contentToPrint = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });

    const handleStockDetails = (username: string) => {
        router.push(`/userwise-stock?username=${encodeURIComponent(username)}`);
    }

    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getGroupUserStockSummary?username=${username}`)
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

    const totalQty = filteredProducts.reduce((total, product) => {
        return total + product?.stockQty;
    }, 0);
    const totalValue = filteredProducts.reduce((total, product) => {
        return total + product?.stockValue;
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
                    <h4 className="font-bold">STOCK SUMMARY</h4>
                    <h4 className="text-lg"><CurrentDate /></h4>

                    <div className="flex flex-col items-center justify-center">

                        <table className="table table-lg table-zebra">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>USER NAME</th>
                                    <th>STOCK QTY</th>
                                    <th>STOCK VALUE</th>
                                    <th>DETAILS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((item, index) => (
                                    <tr key={item.username}>
                                        <td>{index + 1}</td>
                                        <td className="capitalize">{item.username}</td>
                                        <td>{item.stockQty}</td>
                                        <td>{item.stockValue.toLocaleString()}</td>
                                        <td><button onClick={() => handleStockDetails(item.username)} className="btn btn-success btn-xs btn-outline"><CgDetailsMore size={18} /></button></td>
                                    </tr>
                                ))}
                            </tbody>
                            <tr className="font-bold text-sm">
                                <td></td>
                                <td>TOTAL</td>
                                <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number(totalValue.toFixed(2)).toLocaleString('en-IN')}</td>

                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;

