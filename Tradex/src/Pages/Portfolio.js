import React, { useState, useEffect } from 'react';
import Navbar from "../Components/Navbar";
import { Link,useNavigate } from "react-router-dom";
import './Portfolio.css'
import DownloadPortfolio from './downloadPortfolio'


const StockList = () => {
  const [stocks, setStocks] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [ticker, setTicker] = useState('');
  const [quantity, setQuantity] = useState(0);
  const navigate = useNavigate();
  const [originalSubtotal, setOriginalSubtotal] = useState(0);

 
  const handleSellClick = (ticker, price,quantitys) => {
    // Retrieve user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user && user.user && user.user.id;
    console.log(userId)

    // Navigate to the /buy route with state containing ticker, price, and userId
    navigate('/sellPage', { state: { ticker, price, userId,quantitys } });
  };
  const handleBuyClick = (ticker, price) => {
    // Retrieve user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user && user.user && user.user.id;
    console.log(userId)

    // Navigate to the /buy route with state containing ticker, price, and userId
    navigate('/buyPage', { state: { ticker, price, userId } });
  };



  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      // If user data is not present, redirect to the login page
      navigate('/');
      return;
    }
    const fetchStocks = async () => {
      // Retrieve the user object from local storage
      const user = JSON.parse(localStorage.getItem('user'));
      const token = user && user.access_token;
      // Extract the userid from the user object
      const userid = user && user.user && user.user.id;
      console.log(userid)

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/get_stock_by_userid`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ userid: userid }) // Use the userid from local storage
        });

        if (response.ok) {
          const data = await response.json();
          setStocks(data);
          const currentTotal = data.reduce((total, stock) => total + stock.current_price * stock.quantity,  0);
          const originalTotal = data.reduce((total, stock) => total + stock.price * stock.quantity,  0);
          setSubtotal(currentTotal);
          setOriginalSubtotal(originalTotal);
        } else {
          console.error('Failed to fetch stocks');
        }
      } catch (error) {
        console.error('An error occurred during the fetch:', error);
      }
    };

    fetchStocks();
  }, []);
 

  const profitOrLoss = subtotal - originalSubtotal;
  const profitOrLossClass = profitOrLoss >  0 ? 'profit' : 'loss';
  return (
    <div className='Background'>
      <Navbar/>
      <DownloadPortfolio></DownloadPortfolio>
      
      <div className="subtotal-container">
        <h5> Invested : {originalSubtotal.toFixed(2)}</h5>
        <h5 className={profitOrLossClass}>   
          P/L : {profitOrLoss >=   0 ? '+' : '-'} {Math.abs(profitOrLoss).toFixed(2)}
        </h5>
        <h5>   
          Current :{subtotal.toFixed(2)}
        </h5>
      </div>

      <div className="container-fluid pt-5">
        {stocks.map((stock, index) => {
          const profitOrLoss = stock.current_price * stock.quantity - stock.price * stock.quantity;
          const profitOrLossClass = profitOrLoss >  0 ? 'profit' : 'loss';
          const cardBorderColor = profitOrLossClass === 'profit' ? 'border-green' : 'border-red';

          return (
            <div  className= {`card mb-3 ${cardBorderColor}`} key={index}>
              <div className="card-body">
                <h5 className="card-title">{stock.ticker}</h5>
                <div className='row'>
                  <div className='col-md-6'>
                    <div className='card-title' >
                        <strong>Price : </strong>{stock.price}
                        <p className="card-text">
                          <strong>Qty : </strong> {stock.quantity}
                        </p>
                    </div> 
                  </div>
  
                  <div className='col-md-6'>
                  <div className={`card-text ${profitOrLossClass}`} style={{marginBottom:20}}>
                  <strong className="uncolouredText">₹ {(stock.current_price*stock.quantity).toFixed(2)}</strong>
                    <strong className="uncolouredText" style={{marginLeft:20}} >P/L</strong> {profitOrLoss >=   0 ? '+' : '-'} {Math.abs(profitOrLoss).toFixed(2)}
                    <div>
                      <button className="btn btn-sm btn-danger btn-danger1" onClick={() => handleSellClick(stock.ticker, stock.current_price,stock.quantity)}>Sell</button>
                      <button className="btn btn-sm btn-success btn-success1" onClick={() => handleBuyClick(stock.ticker, stock.current_price)}>Buy</button>
                    </div>
                  </div>
                </div>
                
                  
                  
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* <History/> */}
    </div>
  );
};

export default StockList;
