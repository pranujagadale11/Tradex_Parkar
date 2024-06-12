import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import './History.css';
 
 import Downloadbtn from './Downloadbtn';
const TransactionHistory = () => {
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [userId, setUserId] = useState(/* replace with the actual user id */);
 
  // Function to fetch transaction history from the backend API
  const fetchTransactionHistory = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user && user.access_token;
    // Extract the userid from the user object
    const userid = user && user.user && user.user.id;
    try {
      // Replace with your actual API endpoint
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
      } else {
        console.error("Failed to fetch transaction history");
      }
    } catch (error) {
      console.error("An error occurred during transaction history fetch:", error);
    }
  };
 
  // Fetch transaction history on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      // If user data is not present, redirect to the login page
      Navigate('/');
      return;
    }
    fetchTransactionHistory();
  }, [userId]);
 
  return (
    <div>
    <Navbar />
    <Downloadbtn></Downloadbtn>
    <div className="History-container">
        <h1 style={{color:'white', alignContent:"center"}}>Transaction History</h1>
        {transactionHistory.length === 0 ? (
          <p>No transaction history available.</p>
        ) : (
          <ul>
            {transactionHistory.map((transaction, index) => (
              <li key={index} className="transaction-list">
                <p>{transaction.ticker}</p>
                <p>Price: {transaction.price}</p>
                <p>{transaction.date}</p>
                <p>{transaction.action}</p>
                <p>Quantity: {transaction.quantity}</p>
              </li>
            ))}
          </ul>
        )}
    </div>
    </div>
  );
};
 
// Add this inline style object at the end of your component
const historyStyles = {
  maxWidth: '600px',
  margin: '0 auto',
  textAlign: 'center',
  padding: '20px',
};
 
export default TransactionHistory;