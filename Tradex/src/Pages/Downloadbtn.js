import React, { useEffect, useState } from "react";
import './Download.css';
import { CSVLink } from 'react-csv';
 
function Downloadbtn() {
    const [transactionHistory, setTransactionHistory] = useState([]);
    const [loading, setLoading] = useState(true); // Add a loading state
 
    const downloaddata = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user && user.access_token;
        const userid = user && user.user && user.user.id;
        console.log(userid);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/get_history_by_userid`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ userid: userid}),
            });
 
            if (response.ok) {
                const data = await response.json();
                setTransactionHistory(data);
                console.log(data);
                setLoading(false); // Set loading to false after data is fetched
            } else {
                console.error("Failed to fetch transaction history");
            }
        } catch (error) {
            console.error("An error occurred during transaction history fetch:", error);
        }
    };
    useEffect(()=>{
        downloaddata();
    },[])
 
    // Ensure transactionHistory is structured correctly for CSVLink
    const csvData = transactionHistory.map(item => ({
        ticker: item.ticker,
        price: item.price,
        date: item.date,
        action: item.action,
        quantity: item.quantity,
    }));
 
    return (
        <>
            <div className="downloadcontainer">
                {/* Conditionally render CSVLink only if data is loaded */}
                {!loading && (
                    <CSVLink className="downloadbtn" data={csvData} filename={"transaction-history.csv"}>
                        Download CSV
                    </CSVLink>
                )}
            </div>
        </>
    );
}
 
export default Downloadbtn;