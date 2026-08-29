"use client";

import { useAppSelector } from "@/app/store";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Sale {
    saleId: number;
    saleType: string;
    sprice: number;
    discount: number;
    offer: number;
    date: string;
}


const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const searchParams = useSearchParams();
    const cid = searchParams.get('cid');
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    useEffect(() => {

        const loadSales = async () => {

            try {

                const response = await fetch(
                    `${apiBaseUrl}/sales/findSaleEdit/${cid}`
                );

                if (!response.ok) {
                    toast.error("Failed to load sale");
                }

                const data = await response.json();

                setSales(data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }
        };

        loadSales();

    }, [cid, apiBaseUrl]);


    const handleChange = (
        index: number,
        field: keyof Sale,
        value: string | number
    ) => {

        setSales(prev => {

            const updated = [...prev];

            updated[index] = {
                ...updated[index],
                [field]: value,
            };

            return updated;
        });
    };


    const handleSave = async () => {

        try {

            setSaving(true);

            const response = await fetch(
                `${apiBaseUrl}/sales/updateSaleInfo/${cid}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(sales),
                }
            );

            if (!response.ok) {
                toast.error("Update failed");
            }

            const updated = await response.json();

            setSales(updated);

            toast.success("Sale updated successfully");

        } catch (error) {

            console.error(error);

            toast.error("Failed to update sale");

        } finally {

            setSaving(false);

        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }


    return (
        <div className="flex flex-col p-4 min-h-screen">

            <h2 className="text-xl font-bold mb-4">
                Edit Sale
            </h2>

            <div className="overflow-x-auto">
                <table className="table">

                    <thead>
                        <tr>
                            <th>SL</th>
                            <th>SALE TYPE</th>
                            <th>SALE PRICE</th>
                            <th>DISCOUNT</th>
                            <th>OFFER</th>
                            <th>DATE</th>
                        </tr>
                    </thead>

                    <tbody>

                        {sales.map((sale, index) => (

                            <tr key={sale.saleId}>

                                <td>
                                    {index + 1}
                                </td>

                                <td>

                                    <select
                                        className="select select-bordered select-sm"
                                        value={sale.saleType}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "saleType",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="vendor">Vendor</option>
                                    </select>

                                </td>

                                <td>

                                    <input
                                        type="number"
                                        className="input input-bordered input-sm w-28"
                                        value={sale.sprice}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "sprice",
                                                Number(e.target.value)
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <input
                                        type="number"
                                        className="input input-bordered input-sm w-24"
                                        value={sale.discount}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "discount",
                                                Number(e.target.value)
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <input
                                        type="number"
                                        className="input input-bordered input-sm w-24"
                                        value={sale.offer}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "offer",
                                                Number(e.target.value)
                                            )
                                        }
                                    />

                                </td>

                                <td>

                                    <input
                                        type="date"
                                        className="input input-bordered input-sm"
                                        value={sale.date}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "date",
                                                e.target.value
                                            )
                                        }
                                    />

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            <div className="flex items-center justify-center">
                <button
                    className="btn btn-primary mt-5"
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Updating..." : "Update Sale"}
                </button>
            </div>


        </div>
    );
}
export default Page