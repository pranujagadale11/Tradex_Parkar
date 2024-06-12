import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css"; 
 
const Navbar = () => (
  <nav className="navbar-container">
    <NavLink to="/dash" className="brand">
      Trade<span style={{color:"red",fontSize:'1.2em'}}>X</span>
    </NavLink>
    <ul className="nav-links">
      <li>
        <NavLink to="/dash" className={({ isActive, isPending}) => isPending ? "" : isActive ? "active-button" : "nav-button"}>
          Watchlist1
        </NavLink>
      </li>
      <li>
        <NavLink to="/WL2" className={({ isActive, isPending}) => isPending ? "" : isActive ? "active-button" : "nav-button"}>
          Watchlist2
        </NavLink>
      </li>
      <li>
        <NavLink to="/portfolio" className={({ isActive, isPending}) => isPending ? "" : isActive ? "active-button" : "nav-button"}>
          Portfolio
        </NavLink>
      </li>
       <li>
        <NavLink to="/about" className={({ isActive, isPending}) => isPending ? "" : isActive ? "active-button" : "nav-button"}>
          Orders
        </NavLink>
      </li> 
      <li>
        <NavLink to="/Profile" className={({ isActive, isPending}) => isPending ? "" : isActive ? "active-button" : "nav-button"}>
          Profile
        </NavLink>
      </li>
    </ul>
  </nav>
);
 
export default Navbar;