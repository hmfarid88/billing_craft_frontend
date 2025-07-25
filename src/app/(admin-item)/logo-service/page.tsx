"use client"
import React, { useEffect, useState } from 'react'
import { FaRegUser } from "react-icons/fa";
import { toast } from 'react-toastify';
import { MdOutlineWebhook } from 'react-icons/md';
import Image from 'next/image';
interface User {
    username: string;
    link: string;

}
const Page = () => {
    const [pending, setPending] = useState(false);
    const [username, setUserName] = useState("");
    const [logoLink, setLogoLink] = useState("");
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const handleSmsAdd = async (e: any) => {
        e.preventDefault();

        if (!username.trim() || !logoLink.trim()) {
            toast.error("All fields are required!");
            return;
        }
        setPending(true);
        try {
            const response = await fetch(`${apiBaseUrl}/smsapi/sms/update-logolink?username=${username}&link=${logoLink}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },

            });

            if (response.ok) {
                setUserName("");
                setLogoLink('');
                toast.success("Logo added successfully!");

            } else {
                const data = await response.json();
                toast.error(data.message || "Error adding user.");
            }
        } catch (error: any) {
            toast.error(error.message || "Error adding user.")
        } finally {
            setPending(false);
        }
    };
    const [allUsers, setAllUsers] = useState<User[]>([]);

    useEffect(() => {
        fetch(`${apiBaseUrl}/smsapi/sms/allLogoUser`)
            .then(response => response.json())
            .then(data => {
                setAllUsers(data);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, [apiBaseUrl, logoLink]);
    return (
        <div className='container-2xl'>
            <div className="flex flex-col w-full items-center justify-center pt-10">
                <div className="flex">
                    <div className="collapse collapse-arrow bg-base-200">
                        <input type="checkbox" className="peer" />
                        <div className="collapse-title text-sm font-medium">ADD LOGO</div>
                        <div className="collapse-content">
                            <div className="card shadow shadow-slate-700 w-full max-w-sm p-5">

                                <div className="flex flex-col">
                                    <div className="flex p-2">
                                        <label className="input input-bordered flex items-center w-full max-w-xs gap-2">
                                            <FaRegUser />
                                            <input type="text" name='name' value={username} onChange={(e: any) => setUserName(e.target.value)} className="grow" placeholder="Username" />
                                        </label>
                                    </div>
                                    <div className="flex p-2">
                                        <label className="input input-bordered flex items-center w-full max-w-xs gap-2">
                                            <MdOutlineWebhook />
                                            <input type="text" value={logoLink} name='logolink' onChange={(e: any) => setLogoLink(e.target.value)} className="grow" placeholder='Logo Link' />
                                        </label>
                                    </div>

                                    <div className="flex p-2">
                                        <button onClick={handleSmsAdd} className='btn btn-success w-full max-w-xs'>{pending ? "Submitting..." : "ADD LOGO"}</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex p-5">
                    <table className="table table-sm">
                        <thead>
                            <tr>
                                <th>SN</th>
                                <th>USER NAME</th>
                                <th>LOGO</th>

                            </tr>
                        </thead>
                        <tbody>
                            {allUsers?.map((user, index) => (
                                <tr key={index}>
                                    <th>{index + 1}</th>
                                    <td>{user.username}</td>
                                    <td>
                                        <figure>
                                            <Image src={user.link}  alt="Logo" width={64} height={40} />
                                        </figure>
                                    </td>

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