import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignInForm from './Pages/Signup';
import LoginForm from './Pages/Login';
import Portfolio from "./Pages/Portfolio";
import About from "./Pages/About";
import Watchlist1 from './Components/Watchlist1';
import Watchlist2 from './Pages/Watchlist2';
import BuyPage from './Pages/BuyPage';
import SuccessPage  from './Pages/SuccessPage';
import Profile from './Pages/Profile';
import History from './Pages/History';
import SellPage from './Pages/SellPage';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<LoginForm />} />
          <Route path="/signup" exact element={<SignInForm />} />
          {/* <Route path="/dash" exact element={<Dashboard />} /> */}
          <Route path="/dash" exact element={<Watchlist1 />} />
          <Route path="/WL2" exact element={<Watchlist2 />}  />
          <Route path="/portfolio" exact element={<Portfolio />} />
          <Route path="/about" exact element={<About />} />
          <Route path="/buyPage" exact element={<BuyPage />} />
          <Route path="/successPage" exact element={<SuccessPage />} />
          <Route path="/Profile" exact element={<Profile />} />
          <Route path="/history" exact element={<History />} />
          <Route path="/sellPage" exact element={<SellPage />} />
         
 
        </Routes>
      </Router>
    </>
  );
}
 
export default App;