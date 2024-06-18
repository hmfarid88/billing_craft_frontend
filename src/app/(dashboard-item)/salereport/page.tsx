'use client'
import React, { FormEvent, useState, useEffect } from "react";
import { useAppSelector } from "@/app/store";

interface Product {
  cname: string;
  phoneNumber: string;
  address: string;
  productName: string;
  productno: string;
  color: string;
  cid: string;
  sprice: number;
  discount: number;
  offer: number;
  saleDate: string;
}
const Page = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const [soldProducts, setSoldProducts] = useState<Product[]>([]);
  useEffect(() => {
    fetch(`${apiBaseUrl}/api/getProductSale?username=${username}`)
      .then(response => response.json())
      .then(data => {
        setSoldProducts(data);

      })
      .catch(error => console.error('Error fetching products:', error));
  }, [apiBaseUrl, username]);
  return (
    <div className="container-2xl">
      <div className="flex w-full min-h-[calc(100vh-228px)] items-center justify-center">
        <div className="overflow-x-auto">
          <table className="table table-xs">
            <thead>
              <tr>
                <th>SN</th>
                <th>SALE DATE</th>
                <th>INVOICE NO</th>
                <th>CUSTOMER INFO</th>
                <th>PRODUCT</th>
                <th>PRODUCT NO</th>
                <th>QTY</th>
                <th>SALE PRICE</th>
                <th>DISCOUNT</th>
                <th>OFFER</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {soldProducts?.map((product, index) => (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{product.saleDate}</td>
                  <td className="uppercase">{product.cid}</td>
                  <td>{product.cname}, {product.phoneNumber} {product.address}</td>
                  <td>{product.productName}</td>
                  <td>{product.productno}</td>
                  <td>1</td>
                  <td>{product.sprice}</td>
                  <td>{product.discount}</td>
                  <td>{product.offer}</td>
                  <td>{product.sprice - product.discount - product.offer}</td>
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