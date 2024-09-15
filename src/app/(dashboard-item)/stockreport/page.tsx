'use client'
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/app/store";

interface Product {
  brand: string;
  category: string;
  productName: string;
  preqty: number;
  newqty: number;
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
    <div className="container-2xl min-h-[calc(100vh-228px)]">
      <div className="flex w-full p-4 items-center">
        <table className="table table-sm md:table-md">
          <thead>
            <tr>
              <th>SN</th>
              <th>CATEGORY</th>
              <th>BRAND</th>
              <th>PRODUCT NAME</th>
              <th>PREVIOUS</th>
              <th>TODAY</th>
              <th>PRESENT</th>
              <th>MORE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td><button className="btn btn-sm btn-success btn-outline">Details</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Page