import React, { useState, useEffect } from 'react';
import "./Search.css"
import { FaSearch } from "react-icons/fa";

 
function SearchBox({currentPage, watchlistStocks }) { // Assuming userid is passed as a prop
  // console.log(watchlistStocks)
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    // Extract the userid from the user object
    const token = user && user.access_token;
 
    const userid = user && user.user && user.user.id;
    useEffect(() => {
      if (inputValue.length >  0) {
        fetch(`${process.env.REACT_APP_API_URL}/get_first_row`)
          .then(response => response.json())
          .then(data => setSuggestions(data))
          .catch(error => console.error('Error fetching data:', error));
      } else {
        setSuggestions([]);
      }
    }, [inputValue]);
    useEffect(() => {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().startsWith(inputValue.toLowerCase())
      );
      setFilteredSuggestions(filtered);
   }, [suggestions, inputValue]);
    const handleInputChange = (event) => {
      setInputValue(event.target.value);
    };
    const isInWatchlist = (ticker) => {
      if(watchlistStocks.some(stock => stock.ticker === ticker) || watchlistStocks.includes(ticker)){
        console.log(ticker)
      }
      return watchlistStocks.includes(ticker);
   };
    // const filteredSuggestions = suggestions.filter(suggestion =>
    //   suggestion.toLowerCase().startsWith(inputValue.toLowerCase())
    // );
 
    const Addstocks = (suggestion, userid, currentPage) => {
        // Define the data you want to send to the server
        const data = {
          ticker: suggestion,
          userId: userid,
          WL_no: currentPage
        };
      //  console.log(data);
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
        fetch(`${process.env.REACT_APP_API_URL}/add_stock_WL`, requestOptions)
        .then(response => {
          if (response.ok) {
              // If the response is OK, parse the JSON and reload the page
              return response.json().then(data => {
                  console.log('Success:', data);
                  window.location.reload();
              });
          } else {
              // If the response is not OK, throw an error to be caught by the catch block
              alert("Stock already exist in this watchlist")
              throw new Error('Network response was not ok');
          }
      })
      .catch(error => {
          console.error('Error:', error);
          
          // Handle the error appropriately
      });
      };
    
      const RemoveStockFromWL = (suggestion, userid, currentPage) => {
        // Define the data you want to send to the server
        
        const data = {
            ticker: suggestion  + '.NS',
          userId: userid,
          WL_no: currentPage
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
      <div>
       <div className='input'>
        <input id='inputSearch'
          type="text"
          placeholder="Search..."
          value={inputValue}
          onChange={handleInputChange}
          name="inputSearch"
         
        />
        <label className='circle'  htmlFor="inputSearch">
           <FaSearch  />
        </label>
        </div>
        {inputValue.length >  0 && (
          <ul className='Lists'>
            {filteredSuggestions.length === 0 ? (
            <li>No match was found</li>
          ) : (filteredSuggestions.map((suggestion, index) => (
              <li key={index} id='stocks'>
                {suggestion}
                {isInWatchlist(suggestion) ? (
                <button className='btn remove-btn' onClick={() => RemoveStockFromWL(suggestion, userid, currentPage)}>-</button>
              ) : (
                <button className='btn add-btn' onClick={() => Addstocks(suggestion, userid, currentPage)}>+</button>
              )}</li>
            )))}
          </ul>
        )}
      </div>
    );
}
 
export default SearchBox;