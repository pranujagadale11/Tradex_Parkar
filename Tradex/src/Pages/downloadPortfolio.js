import React, { useEffect, useState } from "react";
import './Download.css';
import { CSVLink } from 'react-csv';
 
function DownloadPortfolio() {
    // const [transactionHistory, setTransactionHistory] = useState([]);
    const [loading, setLoading] = useState(true); // Add a loading state
    const [stocks, setStocks] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [profitloss, setProfitLoss] = useState(0);
//   const [quantity, setQuantity] = useState(0);
  const [originalSubtotal, setOriginalSubtotal] = useState(0);

 
    const downloaddata = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user && user.access_token;
        const userid = user && user.user && user.user.id;
        console.log(userid);
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
              setLoading(false);
              setOriginalSubtotal(originalTotal);
              const profitOrLoss = subtotal - originalSubtotal;
              setProfitLoss(profitOrLoss)
            } else {
              console.error('Failed to fetch stocks');
            }
          } catch (error) {
            console.error('An error occurred during the fetch:', error);
          }
    };
    useEffect(()=>{
        downloaddata();
    },[])
 
    // Ensure transactionHistory is structured correctly for CSVLink
    const csvData = stocks.map(item => ({
        ticker: item.ticker,
        price_bought_at: item.price,
        current_price: item.current_price,
        current_time: item.current_time,
        quantity: item.quantity,
        profit_loss : (item.current_price*item.quantity - item.price*item.quantity)
    

    }));
    if (csvData.length > 0) {
        csvData[0].invested_amount = originalSubtotal;
        csvData[0].current_amount = subtotal;
        csvData[0].total_profit_loss = profitloss;
    }
 
    return (
        <>
            <div className="downloadcontainer">
                {/* Conditionally render CSVLink only if data is loaded */}
                {!loading && (
                    <CSVLink className="downloadbtn" data={csvData} filename={"Stock_Portfolio.csv"}>
                        Download PortFolio CSV
                    </CSVLink>
                )}
            </div>
        </>
    );
}
 
export default DownloadPortfolio;