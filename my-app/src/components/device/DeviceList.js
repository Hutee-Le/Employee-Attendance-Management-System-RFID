import React, { useState, useEffect } from 'react';
import '../../assets/css/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import DeviceApi from '../../services/Deviceapi';
import { Modal, Button } from 'react-bootstrap';

const DeviceList = () => {
    const [devices, setDevices] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        try {
            const devices = await DeviceApi.getAllDevices();
            setDevices(devices);
        } catch (error) {
            console.log(error);
        }
    };

    const handleShowDeleteModal = (deviceId) => {
        setSelectedDeviceId(deviceId);
        setShowDeleteModal(true);
    };

    const handleHideDeleteModal = () => {
        setSelectedDeviceId(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async (deviceId) => {
        try {
            await DeviceApi.deleteDevice(deviceId);
            fetchDevices();
            handleHideDeleteModal();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div id="main" className="container mt-5">
            <div className="table-form-container">
                <div className="border rounded p-3 bg-white mt-3">
                    <h2>Assets</h2>
                    <table className="table table-hover table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Device Name</th>
                                <th>Icon</th>
                                <th>Status</th>
                                <th>isOn</th>
                                <th>Room Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devices.map((device, index) => (
                                <tr key={device._id}>
                                    <td>{index + 1}</td>
                                    <td>{device.deviceName}</td>
                                    <td>{device.icon}</td>
                                    <td>{device.status}</td>
                                    <td>{device.isOn ? "ON" : "OFF"}</td>
                                    <td>{device.roomId.name}</td>
                                    <td>
                                        <button className='btn btn-primary ms-3'>Edit</button>
                                        <button className='btn btn-danger ms-3' onClick={() => handleShowDeleteModal(device._id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal show={showDeleteModal} onHide={handleHideDeleteModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this device?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleDelete(selectedDeviceId)}>
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={handleHideDeleteModal}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>

    );
};

export default DeviceList;