"use client"
import React, { useEffect, useState } from 'react'
interface User {
    email: string;
    username: string;
    password: string;
    roles: string;
    status: string;
}
const Page = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const [allUsers, setAllUsers] = useState<User[]>([]);
  
    useEffect(() => {
        fetch(`${apiBaseUrl}/auth/user/userList`)
            .then(response => response.json())
            .then(data => {
                setAllUsers(data);
            })
            .catch(error => console.error('Error fetching users:', error));
    }, [apiBaseUrl]);

    const toggleStatus = async (index: number, username: string, currentStatus: string) => {
        const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
        const updatedUsers = allUsers.map((user, i) =>
            i === index ? { ...user, status: newStatus } : user
        );
        setAllUsers(updatedUsers);

        try {
            await fetch(
                `${apiBaseUrl}/auth/update-status?username=${username}&status=${newStatus}`,
                { method: "PUT" }
            );
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };
  
    const [filterCriteria, setFilterCriteria] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<User[]>([]);
    useEffect(() => {
        const searchWords = filterCriteria.toLowerCase().split(" ");

        const filtered = allUsers.filter(product =>
            searchWords.every(word =>
                (product.email?.toLowerCase().includes(word) || '') ||
                (product.username?.toLowerCase().includes(word) || '') ||
                (product.roles?.toLowerCase().includes(word) || '') ||
                (product.status?.toLowerCase().includes(word) || '')
            )
        );

        setFilteredProducts(filtered);
    }, [filterCriteria, allUsers]);

    const handleFilterChange = (e: any) => {
        setFilterCriteria(e.target.value);
    };
    return (
        <div className='container-2xl'>
            <div className="flex p-3">
                <label className="input input-bordered flex max-w-xs  items-center gap-2">
                    <input type="text" value={filterCriteria} onChange={handleFilterChange} className="grow" placeholder="Search" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-4 w-4 opacity-70">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                </label>
            </div>
            <div className="flex items-center justify-center p-10">
                <table className="table table-sm">
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>EMAIL</th>
                            <th>USER NAME</th>
                            <th>ROLES</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts?.map((user, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{user.email}</td>
                                <td>{user.username}</td>
                                <td>{user.roles}</td>
                                <td>{user.status}</td>
                                <td>
                                    <label className="flex form-control w-full max-w-xs">
                                        <input type="checkbox" checked={user.status === 'ON'} onChange={() => toggleStatus(index, user.username, user.status)} className="toggle toggle-md toggle-success" />
                                    </label>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Page