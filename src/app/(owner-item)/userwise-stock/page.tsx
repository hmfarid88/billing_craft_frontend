
'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import CurrentDate from "@/app/components/CurrentDate";
import { FcPrint} from "react-icons/fc";
import { useReactToPrint } from "react-to-print";
import { useSearchParams } from "next/navigation";

interface Product {
    category: string;
    brand: string;
    productName: string;
    color: string;
    pprice: number;
    countBeforeToday: number;
    countToday: number;
    soldToday: number;
}

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const searchParams = useSearchParams();
    const username = searchParams.get('username');
   
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [showByColor, setShowByColor] = useState(false);
    

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });


    useEffect(() => {
        fetch(`${apiBaseUrl}/api/productStockSummary?username=${username}`)
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
                (product.category?.toLowerCase().includes(word) || '') ||
                (product.brand?.toLowerCase().includes(word) || '') ||
                (product.color?.toLowerCase().includes(word) || '') ||
                (product.productName?.toLowerCase().includes(word) || '')
            )
        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    // 👇 Group by category+brand+productName
    const groupedProducts = Object.values(
        filteredProducts.reduce((acc, product) => {
            const key = `${product.category}|${product.brand}|${product.productName}`;
            if (!acc[key]) {
                acc[key] = { ...product, color: '' };
            } else {
                acc[key].countBeforeToday += product.countBeforeToday;
                acc[key].countToday += product.countToday;
                acc[key].soldToday += product.soldToday;
            }
            return acc;
        }, {} as Record<string, Product>)
    );

    const displayProducts = showByColor ? filteredProducts : groupedProducts;

    const totalPreQty = displayProducts.reduce((total, product) => total + product.countBeforeToday, 0);
    const totalQty = displayProducts.reduce((total, product) => total + product.countToday, 0);
    const totalSold = displayProducts.reduce((total, product) => total + product.soldToday, 0);
    const totalpprice = displayProducts.reduce((total, product) => total + product.pprice * ((product.countBeforeToday + product.countToday) - product.soldToday), 0);

    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">
            <div className="flex justify-between items-center pl-5 pr-5 pt-5">
                <label className="input input-bordered flex max-w-xs items-center gap-2">
                    <input type="text" value={filterCriteria} onChange={(e) => setFilterCriteria(e.target.value)} className="grow" placeholder="Search" />
                </label>
                <div className="flex items-center gap-3">
                    <label className="cursor-pointer label">
                        <input type="checkbox" checked={showByColor} onChange={(e) => setShowByColor(e.target.checked)} className="checkbox checkbox-accent" />
                        <span className="label-text pl-2">Show by Color</span>
                    </label>
                    <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
                </div>
            </div>

            <div ref={contentToPrint} className="flex flex-col p-2 items-center justify-center">
                <h4 className="font-bold">STOCK SUMMARY</h4>
                <h4 className="text-lg"><CurrentDate /></h4>
                 <h4 className="pb-5 uppercase">USER NAME: {username}</h4>
                <div className="flex flex-col items-center justify-center">
                    <div className="flex font-bold pb-3">
                        Total Qty: {totalPreQty + totalQty - totalSold} | Total Value: {(totalpprice).toLocaleString('en-IN')}
                    </div>

                    <table className="table table-sm whitespace-nowrap">
                        <thead className="sticky top-16 bg-base-100">
                            <tr>
                                <th>SN</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th>PRODUCT</th>
                                {showByColor && <th>COLOR</th>}
                                <th>PREVIOUS</th>
                                <th>TODAY</th>
                                <th>SOLD / RETURN</th>
                                <th>PRESENT</th>
                                <th>STOCK VALUE</th>
                            </tr>
                        </thead>

                        <tbody>
                            {displayProducts.map((product, index) => {
                                const present = product.countBeforeToday + product.countToday - product.soldToday;

                                // ✅ Skip row if present is 0
                                if (present === 0) return null;

                                return (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{product.category}</td>
                                        <td>{product.brand}</td>
                                        <td>{product.productName}</td>
                                        {showByColor && <td>{product.color}</td>}
                                        <td>{product.countBeforeToday}</td>
                                        <td>{product.countToday}</td>
                                        <td>{product.soldToday}</td>
                                        <td className={present < 3 ? "text-red-500 font-bold" : ""}>{present}</td>
                                        <td>{product.pprice * present}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr className="font-bold text-sm">
                                <td colSpan={showByColor ? 4 : 3}></td>
                                <td>TOTAL</td>
                                <td>{totalPreQty.toLocaleString('en-IN')}</td>
                                <td>{totalQty.toLocaleString('en-IN')}</td>
                                <td>{totalSold.toLocaleString('en-IN')}</td>
                                <td>{(totalPreQty + totalQty - totalSold).toLocaleString('en-IN')}</td>
                                <td>{(totalpprice).toLocaleString('en-IN')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default Page;

