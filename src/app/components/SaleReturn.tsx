// "use client"
// import React, { useState } from 'react'
// import { toast } from 'react-toastify';
// import { useAppSelector } from "@/app/store";

// const SaleReturn = () => {
//     const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
//     const uname = useAppSelector((state) => state.username.username);
//     const username = uname ? uname.username : 'Guest';
//     const [pending, setPending] = useState(false);
//     const [productno, setProductno] = useState("");

//     const confirmSaleReturn = (e: any) => {
//         e.preventDefault();
//         const isConfirmed = window.confirm("Are you sure to return the sale ?");
//         if (isConfirmed) {
//             submitSaleReturn(e);
//         }
//       };

//     const submitSaleReturn = async (e: React.FormEvent) => {
//         e.preventDefault();

//         if (!productno.trim()) {
//             toast.warning("Product no is required.");
//             return;
//         }

//         setPending(true);

//         try {
//             const response = await fetch(
//                 `${apiBaseUrl}/sales/saleReturn?username=${encodeURIComponent(username)}&productno=${encodeURIComponent(productno)}`,
//                 {
//                     method: 'DELETE',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 toast.info(errorData?.message || "Sale is not returned!");
//                 return;
//             }

//             toast.success("Sale is returned successfully.");
//             setProductno("");

//         } catch (error) {
//             toast.error("An error occurred: " + (error as Error).message);
//         } finally {
//             setPending(false);
//         }
//     };

//     return (

//         <div className="flex items-center justify-center">
//             <div className="flex flex-col gap-3">
//                 <label className="form-control w-full max-w-xs">
//                     <div className="label">
//                         <span className="label-text-alt">PRODUCT NO</span>
//                     </div>
//                     <input type="text" name="productno" onChange={(e: any) => setProductno(e.target.value)} value={productno} placeholder="Type Here" className="input input-bordered w-full max-w-xs" />
//                 </label>
//                 <label className="form-control w-full max-w-xs">
//                     <button onClick={confirmSaleReturn} disabled={pending} className="btn btn-outline btn-success">{pending ? "Wait..." : "RETURN"}</button>
//                 </label>
//             </div>

//         </div>

//     )
// }

// export default SaleReturn

"use client";

import { useState } from "react";
import { useAppSelector } from "@/app/store";
import { toast } from "react-toastify";

interface Sale {
    saleId: number;
    productno?: string;
    productName?: string;
    date?: string;
    time?: string;
    saleType?: string;
    sprice?: number;
    discount?: number;
    offer?: number;
}

interface SaleReturnResponse {
    multiple?: boolean;
    message: string;
    sales?: Sale[];
}

interface Props {
    apiBaseUrl: string;
    username: string;
}

const SaleReturn = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [productno, setProductno] = useState("");
    const [loading, setLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [sales, setSales] = useState<Sale[]>([]);

    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleSaleReturn = async () => {
        if (!productno.trim()) {
            toast.warning("Please enter product number.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${apiBaseUrl}/sales/saleReturn?username=${encodeURIComponent(username)}&productno=${encodeURIComponent(productno.trim())}`,
                {
                    method: "DELETE",
                }
            );

            const data: SaleReturnResponse = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Something went wrong.");
                return;
            }

            /*
             * Multiple sales found
             */
            if (data.multiple === true && data.sales) {
                setSales(data.sales);
                setShowModal(true);
                return;
            }

            /*
             * Only one sale found and deleted
             */
            toast.success(data.message || "Sale deleted successfully.");

            setProductno("");

            // If you have a function to refresh your sales/stock data,
            // call it here.
            // await fetchSales();

        } catch (error) {
            console.error("Sale return error:", error);
            toast.error("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    /*
     * Delete the sale selected by the user
     */
    const handleDeleteSelectedSale = async (saleId: number) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this sale?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setDeletingId(saleId);

            const response = await fetch(
                `${apiBaseUrl}/sales/saleReturn/${saleId}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || "Failed to delete sale.");
                return;
            }

            toast.success(data.message || "Sale deleted successfully.");

            /*
             * Remove deleted sale from modal
             */
            setSales((prev) =>
                prev.filter((sale) => sale.saleId !== saleId)
            );

            /*
             * Close modal if no sales remain
             */
            if (sales.length <= 1) {
                setShowModal(false);
            }

            setProductno("");

            // Refresh your main data here if necessary.
            // await fetchSales();

        } catch (error) {
            console.error("Delete selected sale error:", error);
            toast.error("An error occurred.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            {/* Sale Return Section */}
            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    value={productno}
                    onChange={(e) => setProductno(e.target.value)}
                    placeholder="Enter product no"
                    className="input input-bordered"
                />

                <button
                    onClick={handleSaleReturn}
                    disabled={loading}
                    className="btn btn-primary"
                >
                    {loading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        "Return"
                    )}
                </button>
            </div>

            {/* Multiple Sales Modal */}
            {showModal && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-5xl">

                        <h3 className="font-bold text-lg mb-2">
                            Multiple Sales Found
                        </h3>

                        <p className="text-sm text-base-content/70 mb-4">
                            Product No: <strong>{productno}</strong>
                        </p>

                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">

                                <thead>
                                    <tr>
                                        <th>SL</th>
                                                                          <th>Product</th>
                                        <th>Sale Type</th>
                                        <th>Price</th>
                                        <th>Discount</th>
                                        <th>Offer</th>
                                        <th>Date</th>
                                        <th>Time</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {sales.map((sale, index) => (
                                        <tr key={sale.saleId}>

                                            <td>{index + 1}</td>

                                            <td>
                                                <div>
                                                    <div className="font-medium uppercase">
                                                        {sale.productName || "-"}
                                                    </div>

                                                    <div className="text-xs opacity-60">
                                                        {sale.productno || productno}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="capitalize">
                                                {sale.saleType || "-"}
                                            </td>

                                            <td>
                                                {sale.sprice ?? "-"}
                                            </td>

                                            <td>
                                                {sale.discount ?? "-"}
                                            </td>

                                            <td>
                                                {sale.offer ?? "-"}
                                            </td>

                                            <td>
                                                {sale.date || "-"}
                                            </td>

                                            <td>
                                                {sale.time || "-"}
                                            </td>

                                            <td>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteSelectedSale(
                                                            sale.saleId
                                                        )
                                                    }
                                                    disabled={
                                                        deletingId === sale.saleId
                                                    }
                                                    className="btn btn-error btn-sm"
                                                >
                                                    {deletingId === sale.saleId ? (
                                                        <span className="loading loading-spinner loading-xs"></span>
                                                    ) : (
                                                        "Delete"
                                                    )}
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                        {/* Close button */}
                        <div className="modal-action">
                            <button
                                onClick={() => setShowModal(false)}
                                className="btn"
                                disabled={deletingId !== null}
                            >
                                Cancel
                            </button>
                        </div>

                    </div>

                    {/* Modal background */}
                    <div
                        className="modal-backdrop"
                        onClick={() => {
                            if (deletingId === null) {
                                setShowModal(false);
                            }
                        }}
                    />
                </div>
            )}
        </>
    );
}
export default SaleReturn