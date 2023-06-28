import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/Header.css';
import logo from '../../assets/images/logo.png'
function Header() {
  return (
    <div id="header">
      <nav className="navbar">
        <a className="navbar-brand" href="/"><img src={logo} alt="Logo" width="55" height="55" className="d-inline-block " /> Voltem</a>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/rooms">List of Rooms</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/devices">List of Devices</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/employees">List of Employees</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Header;