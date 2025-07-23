import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../store';

const DiscountHide = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const uname = useAppSelector((state) => state.username.username);
    const username = uname ? uname.username : 'Guest';
    const [status, setStatus] = useState(true);

    useEffect(() => {
        fetch(`${apiBaseUrl}/discount/status?username=${username}`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status === "HIDE");
            })
            .catch((err) => console.error("Error fetching status:", err));
    }, [apiBaseUrl, username]);

    const handleToggleChange = async () => {
        const newStatus = !status;
        setStatus(newStatus);

        try {
            await fetch(
                `${apiBaseUrl}/discount/update-status?username=${username}&status=${newStatus}`,
                { method: "PUT" }
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="flex flex-col gap-5">

            <div className="flex">
                <label className="form-control w-full max-w-xs">
                    <div className="label">
                        <span className="label-text-alt">{status ? "HIDE" : "SHOW"}</span>
                    </div>
                    <input type="checkbox" checked={status} onChange={handleToggleChange} className="toggle toggle-lg toggle-success" />
                </label>
            </div>
        </div>
    )
}

export default DiscountHide