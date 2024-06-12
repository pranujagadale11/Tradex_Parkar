import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./Watchlist.css";
import SearchBox from "./SearchBox";
 
 
 
const Watchlist1 = () => {
  const [stockData, setStockData] = useState([]);
  const navigate = useNavigate();
  const[Loading, isLoading] = useState(true);
  const [stockNamesArray, setStockNamesArray] = useState([]);
 
 
  useEffect(() => {
 
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      // If user data is not present, redirect to the login page
      navigate('/');
      return;
    }
    // Fetch stock prices from the backend when the component mounts
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user && user.access_token;
        const userid = user && user.user && user.user.id;
       // console.log(token)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/get_prices_wl1`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ userid: userid })
        });
        if (response.ok) {
          const data = await response.json();
          const namesArray = Object.keys(data).map(stockName => stockName.replace('.NS', ''));
          setStockNamesArray(namesArray);
          setStockData(data);
        } else {
          console.error("Failed to fetch stock prices");
        }
      } catch (error) {
        console.error("An error occurred during the fetch:", error);
      }
      isLoading(false);
    };
 
    fetchData();
    const intervalId = setInterval(fetchData,  5000);
 
   
    return () => clearInterval(intervalId);
  }, []);
 
 
 
  const handleBuyClick = (ticker, price) => {
   
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user && user.user && user.user.id;
    console.log(userId)
 
   
    navigate('/buyPage', { state: { ticker, price, userId } });
  };
 
 
  const RemoveStockFromWL = (ticker) => {
    // Define the data you want to send to the server
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user && user.access_token;
    // Extract the userid from the user object
    const userid = user && user.user && user.user.id;
    const data = {
        ticker: ticker,
      userId: userid,
      WL_no: 1
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
    fetch(`${process.env.REACT_APP_API_URL}/remove_stock_WL`, requestOptions)
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
    <div className="Watch">
      <Navbar />
      <SearchBox currentPage="1" watchlistStocks={stockNamesArray}/>
      <div className="container">
        { Loading ? (
          <div className="Loading-Container"></div>
        ) : (
          Object.entries(stockData).map(([ticker, stockInfo]) => (
            <div className="stock-item" key={ticker}>
              <div className="stock-info">
                <h5 className="ticker">{ticker}</h5>
                <small className="text-muted">Time: {stockInfo.current_time}</small>
                <h5 className="price">₹{parseFloat(stockInfo.price).toFixed(2)}</h5>
              </div>
              <button
                className="buy-button"
                onClick={() => handleBuyClick(ticker, stockInfo.price)}
              >
                Buy
              </button>
              <button className="buy-button"
              
              onClick={() => RemoveStockFromWL(ticker)}
              
              >Remove</button>
            </div>
          ))
        )}
      </div>
    </div>
 
  );
};
 
export default Watchlist1;