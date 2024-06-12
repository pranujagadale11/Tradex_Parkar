import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import "./Profile.css"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
 
const Profile = () => {
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    fund: 0,
  });
 
  const [AddFundsAmount, setAddFundsAmount] = useState(0);
  const [WithdrawFundsAmount, setWithdrawFundsAmount] = useState(0);
  const handleFundAddChange = (e) => {
           // Ensure there's only one "."
    e.target.value = e.target.value.replace(/(\..*)\./g, '$1');
           // Prevent the first character from being a "."
    if (e.target.value.startsWith('.')) {
      e.target.value = '0'+ e.target.value ;
    }
    const value = e.target.value=== ''? null : Number(e.target.value);
    if (isNaN(value) || value < 0) {
      setAddFundsAmount(null); 
      e.target.value =  '';
    } else {
      setAddFundsAmount(value);
    }
   };
  const handleFundWithdrawChange = (e) => {
           // Ensure there's only one "."
    e.target.value = e.target.value.replace(/(\..*)\./g, '$1');
           // Prevent the first character from being a "."
    if (e.target.value.startsWith('.')) {
      e.target.value = '0'+ e.target.value ;
    }
    const value = e.target.value=== ''? null : Number(e.target.value);
    if (isNaN(value) || value < 0) {
      e.target.value = e.target.value.replace(/[^0-9.]/g, '');
      setWithdrawFundsAmount(null); 
    } else {
      setWithdrawFundsAmount(value);
    }
   };
  // Function to fetch user data from the backend API
  const fetchUserData = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user && user.access_token;
    // Extract the userid from the user object
    const userid = user && user.user && user.user.id;
    console.log(userid)
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL}/get_fund_by_userid`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ userid: userid })
      });
 
      if (response.ok) {
        const data = await response.json();
        setUserData(data[0]); // Assuming the API returns a list with a single user object
      } else {
        console.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("An error occurred during user data fetch:", error);
    }
  };
 
  const handleSignout = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    localStorage.removeItem('user');
    window.location.href = '/';
  }
 
  // Simulate API call to add funds
  const handleAddFunds = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Extract the userid from the user object
    const token = user && user.access_token;
 
    const userid = user && user.user && user.user.id;
    if(AddFundsAmount===0){
      alert("Funds Amount should be greater than 0")
      setAddFundsAmount(0);
      return
    }
    if(AddFundsAmount === null){
      alert("Invalid Funds amount")
      setAddFundsAmount(0);
      return
    }
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL}/add_fund_by_userid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userid: userid, fund: AddFundsAmount }),
    });
 
      if (response.ok) {
        // Update user data after adding funds
        fetchUserData();
        // Optionally, reset the addFundsAmount state
        alert("Funds Added Successfully")
        setAddFundsAmount(0);
      } else {
        alert("Failed to add funds")
        console.error("Failed to add funds");
      }
    } catch (error) {
      console.error("An error occurred during add funds:", error);
    }
  };
 
    // Simulate API call to add funds
  const handleWithdrawFunds = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    // Extract the userid from the user object
    const token = user && user.access_token;
    if(WithdrawFundsAmount===0){
      alert("Funds Amount should be greater than 0")
      setWithdrawFundsAmount(0);
      return
    }
    if(WithdrawFundsAmount === null){
      alert("Invalid Funds amount")
      setWithdrawFundsAmount(0);
      return
    }
    const userid = user && user.user && user.user.id;
    try {
      // Replace with your actual API endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL}/withdraw_fund_by_userid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userid: userid, fund: WithdrawFundsAmount }),
    });
 
      if (response.ok) {
        // Update user data after adding funds
        fetchUserData();
        // Optionally, reset the addFundsAmount state
        alert("Fund Withdrawn Successfully")
        setWithdrawFundsAmount(0);
        console.log(user.id)
      } else {
        alert("Not Enough Fund")
        console.error("Failed to Withdraw funds");
      }
    } catch (error) {
      console.error("An error occurred during Withdrawing funds:", error);
    }
  };
 
  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);
 
  return (
    <div>
    <Navbar />
    <div className="profile-container">
      <div className="user-details card">
      <FontAwesomeIcon icon={faUser} size="8x" color="white"  />
        {/* <img src={defaultImage} alt="Profile" style={{ maxWidth: "30%", display: "block", margin: "0 auto" }} /> */}
        <hr></hr>
        <h1>{userData.name}</h1>
        <h2>ID: {userData.id}</h2>
        <h2>Email: {userData.email}</h2>
        <div>
          <button className="signout-button" onClick={handleSignout}>SIGN OUT</button>
        </div>
      </div>
      <div className="funds-section card">
        <h1>Fund Section</h1>
        <h3><strong>₹ </strong>{userData.fund}</h3>
        <hr></hr>
        <div className="AddWith">
          <div className="Add">
           <h2>Add Funds</h2>
           <input
             type="number"
             value={AddFundsAmount === null ? '': AddFundsAmount}
             onChange={handleFundAddChange}
             min="0"
             step="1"
             required
           />
           <button className='add-button' onClick={handleAddFunds}>ADD</button>
          </div>
          <div className="Withdraw">
            <h2>Withdraw Funds</h2>
            <input
              type="number"
              value={WithdrawFundsAmount === null ? '': WithdrawFundsAmount}
              onChange={handleFundWithdrawChange}
              min="0"
              step="1"
              required
            />
            <button className='withdraw-button' onClick={handleWithdrawFunds}>WITHDRAW</button>
          </div>
        </div>
        <div>
          <Link to="/history">
            <button className="history-button">TRANSACTION HISTORY</button>
          </Link>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Profile;