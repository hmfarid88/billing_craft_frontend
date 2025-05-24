'use client'
import React, { useState, useEffect } from "react";
import { useAppSelector } from "@/app/store";
import { useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

interface Product {
    id: number;
    date: string;
    supplierName: string;
    paymentType: string;
    note: string;
    amount: number;

}

const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';

    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [editableProduct, setEditableProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [maxDate, setMaxDate] = useState('');

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        setMaxDate(formattedDate);

    }, []);
    useEffect(() => {
        setLoading(true);
        fetch(`${apiBaseUrl}/payment/getSupplierPayById?id=${id}&username=${username}`)
            .then(response => response.json())
            .then(data => {
                setEditableProduct(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
                setLoading(false);
            });
    }, [apiBaseUrl, username, id]);

    const handleInputChange = (field: keyof Product, value: string | number) => {
        if (editableProduct) {
            setEditableProduct({
                ...editableProduct,
                [field]: value,
            });
        }
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        if (!editableProduct || !editableProduct.id) {
            toast.warning("Payment is required to update.");
            return;
        }
        setIsSaving(true);

        fetch(`${apiBaseUrl}/payment/supplierpay/update/${editableProduct.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(editableProduct),
        })
            .then(async response => {
                setIsSaving(false);
                const data = await response.json();

                if (response.ok) {
                    toast.info(data.message || "Payment updated successfully!");
                } else {
                    toast.warning(data.message || "Failed to update payment.");
                }
            })
            .catch(error => {
                console.error("Error updating payment:", error);
                toast.error("Error occurred while updating payment.");
                setIsSaving(false);
            });
    };

    const [supplierOption, setSupplierOption] = useState([]);
    useEffect(() => {
        fetch(`${apiBaseUrl}/api/getSupplierItem?username=${username}`)
            .then(response => response.json())
            .then(data => {
                setSupplierOption(data);
            })
            .catch(error => console.error('Error fetching products:', error));
    }, [apiBaseUrl, username]);
const handleDeleteSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiBaseUrl}/payment/deleteSupplierpayById/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (!response.ok) {
                // const error = await response.json();
                toast.error("Sorry, payment is not deleted!");
            } else {
                toast.success("Information deleted successfully.");

            }

        } catch (error: any) {
            toast.error(error.message)
        }
    }
    return (
        <div className="container-2xl min-h-[calc(100vh-228px)]">
            <div className="flex flex-col p-2 items-center justify-center">
                <h4 className="font-bold">PAYMENT INFORMATION</h4>

                {loading ? (
                    <p>Loading...</p>
                ) : editableProduct ? (
                    <>
                        <div className="flex items-center justify-center pt-5">
                            <table className="table table-sm">
                                <tbody>
                                    <tr>
                                        <th>ENTRY DATE</th>
                                        <td>
                                            <input
                                                type="date"
                                                className="input input-sm w-[50%] input-bordered"
                                                value={editableProduct.date} max={maxDate}
                                                onChange={(e) => handleInputChange('date', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>SUPPLIER NAME</th>
                                        <td>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text" readOnly
                                                    className="input input-sm input-bordered w-[50%] h-[48px]"
                                                    value={editableProduct.supplierName}
                                                    onChange={(e) => handleInputChange('supplierName', e.target.value)}
                                                />
                                                <select className='select select-bordered w-[50%]' onChange={(e) => handleInputChange('supplierName', e.target.value)}>
                                                    <option selected disabled>Select . . .</option>
                                                    {supplierOption?.map((name: any, index) => (
                                                        <option key={index} value={name.supplierItem}>
                                                            {name.supplierItem}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>PAYMENT TYPE</th>
                                        <td>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text" readOnly
                                                    className="input input-sm input-bordered w-[50%] h-[48px]"
                                                    value={editableProduct.paymentType}
                                                    onChange={(e) => handleInputChange('paymentType', e.target.value)}
                                                />

                                                <select className='select select-bordered w-[50%]' onChange={(e) => handleInputChange('paymentType', e.target.value)}>
                                                    <option selected disabled>Select . . .</option>
                                                    <option value="payment">PAYMENT</option>
                                                    <option value="receive">RECEIVE</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>PAYMENT NOTE</th>
                                        <td>
                                            <input
                                                type="text"
                                                className="input input-sm w-[50%] input-bordered"
                                                value={editableProduct.note}
                                                onChange={(e) => handleInputChange('note', e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>AMOUNT</th>
                                        <td>
                                            <input
                                                type="number"
                                                className="input input-sm w-[50%] input-bordered"
                                                value={editableProduct.amount}
                                                onChange={(e) => handleInputChange('amount', e.target.value)}
                                            />
                                        </td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>
                        <button
                            className="btn btn-primary mt-4"
                            onClick={handleSave}
                            disabled={isSaving} >
                            {isSaving ? "Saving..." : "Update"}
                        </button>
                        <div className="flex items-center justify-center p-2">
                            <label className="form-control w-full max-w-xs pt-5">
                                <button className="btn btn-error"
                                    onClick={(e) => {
                                        if (window.confirm("Are you sure you want to delete this item?")) {
                                            handleDeleteSubmit(e);
                                        }
                                    }}

                                >
                                    DELETE THIS ITEM
                                </button>

                            </label>
                        </div>
                    </>
                ) : (
                    <p>Sorry, No expense data found.</p>
                )}
            </div>
            <ToastContainer theme="dark" autoClose={1000} />
        </div>
    );
};

export default Page;
