// import React from 'react'
// import { BarChart, Bar, YAxis, XAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
// const data = [
//     {
//       "name": "January",
//       "Mobile": 4000,
//       "Accessories": 2400
//     },
//     {
//       "name": "February",
//       "Mobile": 3000,
//       "Accessories": 1398
//     },
//     {
//       "name": "March",
//       "Mobile": 2000,
//       "Accessories": 9800
//     },
//     {
//       "name": "April",
//       "Mobile": 2780,
//       "Accessories": 3908
//     },
//     {
//       "name": "May",
//       "Mobile": 1890,
//       "Accessories": 4800
//     },
//     {
//       "name": "June",
//       "Mobile": 2390,
//       "Accessories": 3800
//     }

//   ]
// const Barchart = () => {
//     return (
//         <div>
//           <ResponsiveContainer width={600} height={250}>
//             <BarChart  data={data}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="name" tickMargin={10} />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend verticalAlign='top' height={36} />
//                 <Bar dataKey="Mobile" fill="#8884d8" />
//                 <Bar dataKey="Accessories" fill="#82ca9d" />
//             </BarChart>
//             </ResponsiveContainer>
//         </div>

//     )
// }

// export default Barchart;

import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAppSelector } from '../store';

interface SalesData {
  name: string; // Month Name
  totalSaleValue: number;
}

const Barchart = () => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const uname = useAppSelector((state) => state.username.username);
  const username = uname ? uname.username : 'Guest';
  const [data, setData] = useState<SalesData[]>([]);

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/sales/last-six-months?username=${username}`);
        const result = await response.json(); // Corrected: Removed redundant `.then()`
        setData(result); // Updated: Use `result` directly
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };
    fetchData();
  }, [apiBaseUrl, username]); 

  return (
    <div>
      <ResponsiveContainer width={600} height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} tickMargin={25} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="totalSaleValue" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Barchart;
