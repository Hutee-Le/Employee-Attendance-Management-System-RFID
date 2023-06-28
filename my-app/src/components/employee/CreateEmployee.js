//import liraries
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/css/style.css'
import EmployeeApi from '../../services/EmployeeApi';

// create a component
const CreateEmployee = () => {
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState({
        name: '',
        employeeCode: '',
        position: '',
        rfid: ''
      });
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
          await EmployeeApi.addEmployee(employeeData);
          // Xử lý khi thành công
          navigate('/employees', { state: { successMessage: 'Create employee successfully' } });
        } catch (error) {
          console.error(error);
        }
      };
    return (
        <div className='container mt-5'>
      <div className='border rounded p-5 shadow'>
        <h1 className='ms-3'>Create Employee</h1>
        <form onSubmit={handleSubmit}>
        <div className="mb-3">
            <label htmlFor="employeeCode" className="form-label">Employee Code <span className="required">*</span></label>
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
            <label htmlFor="name" className="form-label">Name <span className="required">*</span></label>
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
            <label htmlFor="position" className="form-label">Position <span className="required">*</span></label>
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
            <label htmlFor="rfid" className="form-label">RFID <span className="required">*</span></label>
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
            <button type="submit" className="btn btn-success">Submit</button>
            <Link to='/employees' className="btn btn-secondary ms-2">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
    );
};
//make this component available to the app
export default CreateEmployee;