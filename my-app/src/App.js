import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import DeviceList from './components/device/DeviceList';
import EmployeeList from './components/employee/EmployeeList';
import CreateEmployee from './components/employee/CreateEmployee';
import EditEmployee from './components/employee/EditEmployee';
import RoomList from './components/room/RoomList';
import Header from './components/common/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      
      <Routes>
        <Route path="/" element={<DeviceList />} />
        <Route path="/rooms" element={<RoomList />} />
        <Route path="/devices" element={<DeviceList />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/create-employee" element={<CreateEmployee />} />
        <Route path="/edit-employee/:id" element={<EditEmployee />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;