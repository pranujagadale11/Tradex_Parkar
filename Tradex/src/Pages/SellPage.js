import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";



const BuyPage = () => {
  const [quantity, setQuantity] = useState(1);
  const [price2, setPrice2] = useState(1); 
  const navigate = useNavigate();
  const location = useLocation();
 
  // Retrieve the state passed from the Watchlist1 component
  const { ticker, price, userId ,quantitys} = location.state;
  console.log(ticker,price,userId);
  const totalPrice = parseFloat(price2 || price) * quantity;
  const handlePriceChange = (e) => {
    // Parse the input value to a number
      // Check if the backspace key is pressed and the input is empty or contains a single digit
      if (e.keyCode === 8 && (e.target.value === '' || e.target.value.length === 1) || e.nativeEvent.data == '-') {
        // Clear the input field
        console.log(e.key)
        e.target.value = '';
        setPrice2(null); // Assuming setPrice2 updates your state
    } else {
        // Parse the input value to a number
        const value = Number(e.target.value);
       
        // Check if the value is not a number or if it's negative
        if (isNaN(value) || value < 0) {
            // If the value is not a number or negative, reset the state
            setPrice2(null);
        } else {
            // Otherwise, update the state with the valid value
            setPrice2(value);
        }
      }
     };
  const handleQuantityChange = (e) => {
    // Parse the input value to a number
    // Check if the backspace key is pressed and the input is empty or contains a single digit
    if (e.keyCode === 8 && (e.target.value === '' || e.target.value.length === 1) || e.key === '-') {
      // Clear the input field
      e.target.value = '';
      setQuantity(null); // Assuming setQuantity updates your state
  } else {
      // Parse the input value to a number
      const value = Number(e.target.value);
     
      // Check if the value is not a number or if it's negative
      if (isNaN(value) || value < 0) {
          // If the value is not a number or negative, reset the state
          setQuantity(null);
      } else {
          // Otherwise, update the state with the valid value
          setQuantity(value);
      }
    }
   };
  const handleSubmit = async (event) => {
    event.preventDefault();
    

    // Retrieve user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user && user.access_token;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/sell_stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ticker,
          userid: userId,
          price: price2 || price, 
          quantity
        })

      });

      if (response.ok) {
        // Handle successful purchase
        console.log("Stock purchased successfully");
        navigate('/successPage'); // Redirect to a success page or back to the watchlist
      } else {
        // Handle error
        console.error("Failed to purchase stock");
        alert('Not enoguh stocks to sell.');

      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };
  const handleSetLimit = async (event) => {
    event.preventDefault();
console.log("test");
    // Retrieve user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user && user.access_token;
    const userid = user && user.user && user.user.id;

console.log(ticker,userid,price,quantity)
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/bid_on_stock`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          ticker,
          userid: userId,
          price: price2 || price, // Use the price from the second card if it's set
          quantity,
          action:"sell"

        })
      });

      if (response.ok) {
        // Handle successful limit setting
        console.log("Limit set successfully");
        navigate('/successPage'); // Redirect to a success page or back to the watchlist
      } else {
        // Handle error
        console.error("Failed to set limit");
        alert('Failed to set limit.');
      }
    } catch (error) {
      console.error("An error occurred during the fetch:", error);
    }
  };

  return (
    
  <div className="sell">
        <Navbar/>
    <div className="container"> 
      <div className="d-flex justify-content-between">
        <div className="card">
          <div className="card-header">
            <h2>Sell Stock: {ticker}</h2>
          </div>
          <div className="card-body">
            <h4>Price per unit: {price.toFixed(2)}</h4>
            <h4>Total Price for {quantity} units: {totalPrice.toFixed(2)}</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <h4>Available Quantity:{quantitys}</h4>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity || ''}
                  onChange={handleQuantityChange}
                  min="0"
                  step="1"
                  required
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-danger">Sell</button>
            </form>
          </div>
      </div>
        <div className="card flex-fill">
            <div className="card-header">
              <h2>Set Limit Stock: {ticker}</h2>
            </div>
            <div className="card-body">
              <h4>Price per unit: {price2 ? price2 : 'Not set'}</h4>
              <h4>Total Price for {quantity} units: {totalPrice.toFixed(2)}</h4>
              <form onSubmit={handleSetLimit}> {/* Updated to use handleSetLimit */}
                <div className="mb-3">
                  <label htmlFor="price2" className="form-label">Price per unit (optional):</label>
                  <input
                    type="number"
                    id="price2"
                    name="price2"
                    placeholder="Set Price"
                    value={price2 || ''}
                    onChange={handlePriceChange}
                    min="0"
                    step="1"
                    className="form-control"
                  />
                </div>
                <button type="submit" className="btn btn-primary">Set Limit</button>
              </form>
            </div>
          </div>
      </div>
   </div>
 </div>
  );
};

export default BuyPage;
