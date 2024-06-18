'use client'
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/app/store";

interface Product {
  id: string;
  brand: string;
  category: string;
  color: string;
  pprice: number;
  productName: string;
  productno: string;
  receiveDate: string;
  sprice: number;
  supplier: string;
  supplierInvoice: string;
  username: string;

}

const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getProductStock?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setAllProducts(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);
  return (
    <div className="container-2xl">
      <div className="flex w-full min-h-[calc(100vh-228px)] p-4 items-center justify-center">
        <div className="overflow-x-auto">
          <table className="table table-sm md:table-md">
            <thead>
              <tr>
                <th>SN</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>PRODUCT NAME</th>
                <th>COLOR NAME</th>
                <th>PRODUCT NO</th>
                <th>PURCHASE PRICE</th>
                <th>SALE PRICE</th>
                <th>SUPPLIER NAME</th>
                <th>SUPPLIER INVOICE</th>
                <th>STOCK DATE</th>
              </tr>
            </thead>
            <tbody>
              {allProducts?.map((product, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>{product.productName}</td>
                  <td>{product.color}</td>
                  <td>{product.productno}</td>
                  <td>{product.pprice}</td>
                  <td>{product.sprice}</td>
                  <td>{product.supplier}</td>
                  <td>{product.supplierInvoice}</td>
                  <td>{product.receiveDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Page