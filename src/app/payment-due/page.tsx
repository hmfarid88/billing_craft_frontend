
'use client'

import { useEffect, useState } from "react";

export default function PaymentDuePage() {
  const [username, setUsername] = useState("");
  const [dueAmount, setDueAmount] = useState("");

  useEffect(() => {
    setUsername(localStorage.getItem("dueUser") || "");
    setDueAmount(localStorage.getItem("dueAmount") || "");
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-red-600">Access Suspended</h2>
      <p className="mt-2">Dear <strong>{username}</strong>,</p>
      <p>You have an unpaid balance of <strong>৳{dueAmount}</strong>.</p>
      <p>Please complete your payment to regain access.</p>
      <a
        href={`/gateWay/bkash/create?username=${username}&amount=${dueAmount}`}
        className="mt-6 inline-block bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        target="_blank"
      >
        Pay with bKash
      </a>
    </div>
  );
}
