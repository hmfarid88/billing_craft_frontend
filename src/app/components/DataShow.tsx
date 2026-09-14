"use client"
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useAppSelector } from "@/app/store";

const DataShow = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [pending, setPending] = useState(false);

    const [percent, setPercent] = useState("");
    const [currentPercent, setCurrentPercent] = useState<number>(100);

    // Get present percentage
    useEffect(() => {
        const fetchCurrentPercent = async () => {
            try {
                const response = await fetch(
                    `${apiBaseUrl}/api/getDataPercent?username=${encodeURIComponent(username)}`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch current percentage");
                }

                const data = await response.json();
                if (data === null || data === undefined || data === "") {
                    setCurrentPercent(100);
                } else if (typeof data === "object" && data !== null) {
                    setCurrentPercent(
                        data.percent !== null && data.percent !== undefined
                            ? Number(data.percent)
                            : 100
                    );
                } else {
                    setCurrentPercent(Number(data) || 100);
                }
            } catch (error: any) {
                console.error(error);
            }
        };

        if (username && username !== "Guest") {
            fetchCurrentPercent();
        }
    }, [apiBaseUrl, username, percent]);

    const submitDataInfo = async (e: any) => {
        e.preventDefault();
        if (!percent) {
            toast.warning("All field is required");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/api/dataShowEntry`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ percent, username }),
            });

            if (!response.ok) {
                toast.error("Data not submitted !");
                return;
            } else {
                toast.success("Info added successfully.")
                setPercent("");

            }
        } catch (error: any) {
            toast.error("An error occurred: " + error.message);
        } finally {
            setPending(false);
        }

    }
    return (

        <div className="flex items-center justify-center">
            <div className="flex flex-col gap-3">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">DATA SHOW (%)</span>
                        <span className="label-text-alt">PRESENT {currentPercent} (%)</span>
                    </div>
                    <input type="number" name="item" onChange={(e: any) => setPercent(e.target.value)} value={percent} placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                </label>
                <label className="form-control w-full max-w-xs">
                    <button onClick={submitDataInfo} disabled={pending} className="btn btn-outline btn-success">{pending ? "Submitting..." : "SUBMIT"}</button>
                </label>
            </div>

        </div>

    )
}

export default DataShow