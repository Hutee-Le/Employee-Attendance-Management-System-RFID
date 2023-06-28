// import liraries
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useParams, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import EmployeeApi from '../../services/EmployeeApi';

// create a component
const EditEmployee = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();

  const [employeeData, setEmployeeData] = useState({
    name: '',
    employeeCode: '',
    position: '',
    rfid: ''
  });

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const employee = await EmployeeApi.getEmployeeById(id);
        setEmployeeData(employee);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchEmployee(id);
  }, [id]); // Thêm 'id' vào mảng dependency


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await EmployeeApi.updateEmployee(id, employeeData); // Gọi API để cập nhật thông tin nhân viên
    //   toast.success('Employee updated successfully');
      navigate('/employees', { state: { successMessage: 'Employee updated successfully' } });
      // Xử lý sau khi cập nhật thành công, ví dụ: điều hướng đến trang danh sách nhân viên
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className='container mt-5'>
      <div className='border rounded p-5 shadow'>
        <h1 className='ms-3'>Edit Employee</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="employeeCode" className="form-label">Employee Code</label>
            <input
              type="text"
              className="form-control"
              id="employeeCode"
              name="employeeCode"
              value={employeeData.employeeCode}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={employeeData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="position" className="form-label">Position</label>
            <input
              type="text"
              className="form-control"
              id="position"
              name="position"
              value={employeeData.position}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="rfid" className="form-label">RFID</label>
            <input
              type="text"
              className="form-control"
              id="rfid"
              name="rfid"
              value={employeeData.rfid}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className='d-flex justify-content-end'>
            <button type="submit" className="btn btn-primary">Save</button>
            <Link to='/employees' className="btn btn-secondary ms-2">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmployee;