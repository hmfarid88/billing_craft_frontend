'use client'
import React, { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/app/store";
import { useReactToPrint } from "react-to-print";
import { FcPrint } from "react-icons/fc";
import CurrentDate from "@/app/components/CurrentDate";
interface Product {

    brand: string;
    category: string;
    oldpprice: number;
    newpprice: number;
    productName: string;
    productno: string;
    date: string;
    supplier: string;

}
const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    const contentToPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => contentToPrint.current,
    });
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/pricedrop-list?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setAllProducts(data);
                setFilteredProducts(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);


    useEffect(() => {
        const filtered = allProducts.filter(product =>
            (product.category?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.brand?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.date?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.productno?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.supplier?.toLowerCase().includes(filterCriteria.toLowerCase()) || '') ||
            (product.productName?.toLowerCase().includes(filterCriteria.toLowerCase()) || '')

        );
        setFilteredProducts(filtered);
    }, [filterCriteria, allProducts]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };

    const totalQty = new Set(filteredProducts.map(product => product.productno)).size;

    const totalPprice = filteredProducts.reduce((total, product) => {
        return total + product.oldpprice;
    }, 0);

    const totalSprice = filteredProducts.reduce((total, product) => {
        return total + product.newpprice;
    }, 0);
    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">

            <div className="flex justify-between pl-5 pr-5 pt-5">
                <label className="input input-bordered flex max-w-xs  items-center gap-2">
                    <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
                <button onClick={handlePrint} className='btn btn-ghost btn-square'><FcPrint size={36} /></button>
            </div>

            <div ref={contentToPrint} className="flex flex-col p-2 items-center justify-center">
                <h4 className="font-bold">PRICE-DROP LIST</h4>
                <h4 className="pb-5"><CurrentDate /></h4>
                <div className="flex items-center justify-center">
                    <table className="table table-sm capitalize">
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>DATE</th>
                                <th>CATEGORY</th>
                                <th>BRAND</th>
                                <th>PRODUCT</th>
                                <th>SUPPLIER</th>
                                <th>PRODUCT NO</th>
                                <th>OLD PURCHASE</th>
                                <th>NEW PURCHASE</th>


                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts?.map((product, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{product.date}</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.productName}</td>
                                    <td>{product.supplier}</td>
                                    <td>{product.productno}</td>
                                    <td>{product.oldpprice}</td>
                                    <td>{product.newpprice}</td>

                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold text-lg">
                                <td colSpan={5}></td>
                                <td>TOTAL</td>
                                <td>{Number(totalQty.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number(totalPprice.toFixed(2)).toLocaleString('en-IN')}</td>
                                <td>{Number(totalSprice.toFixed(2)).toLocaleString('en-IN')}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Page