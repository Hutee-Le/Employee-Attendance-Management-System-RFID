//import liraries
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useLocation } from 'react-router-dom';
import EmployeeApi from '../../services/EmployeeApi';

// create a component
const EmployeeList = () => {
    const location = useLocation();
    const [employees, setEmployees] = useState([]);
    const [isToastShown, setIsToastShown] = useState(false); // Biến cờ để theo dõi đã hiển thị toast chưa

    useEffect(() => {
        const { state } = location;
        const localStorageShown = localStorage.getItem('isToastShown');

        if (state && state.successMessage && !isToastShown && !localStorageShown) {
            toast.success(state.successMessage);
            setIsToastShown(true);
            localStorage.setItem('isToastShown', 'true');
        } else {
            localStorage.removeItem('isToastShown');
        }

        fetchEmployees();
    }, [location, isToastShown]);

    const fetchEmployees = async () => {
        try {
            const employeesData = await EmployeeApi.getAllEmployees();
            setEmployees(employeesData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (employeeId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this employee?');
        if (confirmDelete) {
            try {
                // Xử lý khi nhấn nút Delete
                await EmployeeApi.deleteEmployee(employeeId);
                fetchEmployees();
                toast.success('Employee deleted successfully');
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <div className='container mt-5'>
            <ToastContainer />
            <div className='border rounded p-5 shadow'>
                <h1 className='ms-3'>Employee List</h1>
                <div className='d-flex justify-content-end'>
                    <Link to="/create-employee" className="btn btn-success mt-2 mb-2 me-3">Create Employee</Link>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Employee Code</th>
                                <th>Name</th>
                                <th>Position</th>
                                <th>RFID</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee._id}>
                                    <td>
                                        {employee.image && (
                                            <img src={`/uploads/${employee.image}`} alt="Employee" style={{ width: '110px', height: '100px' }} />
                                        )}
                                    </td>
                                    <td>{employee.employeeCode}</td>
                                    <td>{employee.name}</td>
                                    <td>{employee.position}</td>
                                    <td>{employee.rfid}</td>
                                    <td>{employee.status}</td>
                                    <td>{employee.date}</td>
                                    <td>
                                        <Link
                                            to={`/edit-employee/${employee._id}`}
                                            className="btn btn-primary"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            className="btn btn-danger ms-2"
                                            onClick={() => handleDelete(employee._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
