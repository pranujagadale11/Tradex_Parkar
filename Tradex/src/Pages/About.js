import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
 
import './Order.css';
// import Downloadbtn from "./Download";
const Order = () => {
  const [LimitHistory, setLimitHistory] = useState([]);
  const [userId, setUserId] = useState(/* replace with the actual user id */);
 
  // Function to fetch transaction history from the backend API
  const fetchLimitHistory = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user && user.access_token;
    // Extract the userid from the user object
    const userid = user && user.user && user.user.id;
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL}/openorders`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ userid: userid}),
 
      });
 
      if (response.ok) {
        const data = await response.json();
        setLimitHistory(data);
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
    fetchLimitHistory();
  }, [userId]);
 

  
  const CancelOpenOrder = (id,ticker,price,action) => {
    // Define the data you want to send to the server
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user && user.access_token;
    // Extract the userid from the user object
    const userid = user && user.user && user.user.id;
    const data = {
      id,
        ticker: ticker,
      userId: userid,
      price,
      action
    };
   console.log(data);
    // Convert the data to JSON format
    const jsonData = JSON.stringify(data);
  
    // Define the request options
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include the token in the Authorization header if needed
        'Authorization': `Bearer ${token}`
      },
      body: jsonData
    };
  
    // Make the POST request to your server
    fetch(`${process.env.REACT_APP_API_URL}/removeorders`, requestOptions)
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        window.location.reload();
        // Optionally, you can update the UI or state here based on the response
      })
      .catch(error => {
        console.error('Error:', error);
        // Handle the error appropriately
      });
  };
  
  return (
    <div>
    <Navbar />
    {/* <Downloadbtn></Downloadbtn> */}
    <div className="History-container">
        <h1 style={{color:'white', alignContent:"center"}}>Your Order</h1>
        {LimitHistory.length === 0 ? (
          <p>No transaction history available.</p>
        ) : (
          <ul>
            {LimitHistory.map((LimitHistory, index) => (
              <li key={index} className="Limit-list">
                <p className="ticker">{LimitHistory.ticker}</p>
                <p className="stockname">Price: {LimitHistory.price}</p>
                <p className="price">Qty{LimitHistory.quantity}</p>
                <p className="action">action: {LimitHistory.action}</p>
                {/* <p>Userid: {LimitHistory.userid}</p> */}
 
 
                {/* <p>{transaction.date}</p>
                <p>{transaction.action}</p>
                <p>Quantity: {transaction.quantity}</p> */}
                <button className="cancel-btn"
                  onClick={() => CancelOpenOrder(LimitHistory.id,LimitHistory.ticker,LimitHistory.price,LimitHistory.action)}
                
                >Cancel</button>
              </li>
            ))}
          </ul>
        )}
    </div>
    </div>
  );
};
 
// Add this inline style object at the end of your component
 
 
export default Order;
 