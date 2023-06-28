const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Room = require('../models/Room')
// Lấy danh sách customer
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.find().populate('roomId');
        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy thông tin một khách hàng bằng ID
router.get('/:customerId', async (req, res) => {
    try {
        const customer = await Customer.findOne({ customerId: req.params.customerId }).populate('roomId');
        if (!customer) {
            return res.status(404).json({ message: 'Cannot find customer' });
        }
        return res.json(customer);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

// Tạo mới một khách hàng
router.post('/', async (req, res) => {
    const customer = new Customer({
        customerId: req.body.customerId,
        name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
        image: req.body.image,
        email: req.body.email,
        roomId: req.body.roomId
    });
    try {
        // Lấy thông tin phòng
        const room = await Room.findById(req.body.roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.customers.push(customer);
        await room.save();
        const newCustomer = await customer.save();
        res.status(201).json(newCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật thông tin của một khách hàng bằng ID
router.put("/:customerId", async (req, res) => {
    try {
        const customer = await Customer.findOne({ customerId: req.params.customerId });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
        if(req.body.customerId != null) {
            customer.customerId = req.body.customerId;
        }
        if (req.body.name != null) {
            customer.name = req.body.name;
        }
        if (req.body.address != null) {
            customer.address = req.body.address;
        }
        if (req.body.phone != null) {
            customer.phone = req.body.phone;
        }
        if (req.body.image != null) {
            customer.image = req.body.image;
        }
        if (req.body.email != null) {
            customer.email = req.body.email;
        }
        if (req.body.checkIn != null) {
            customer.checkIn = req.body.checkIn;
        }
        if (req.body.checkOut != null) {
            customer.checkOut = req.body.checkOut;
        }
        if (req.body.roomId != null) {
            customer.room = req.body.roomId;
        }
        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// Xóa một khách hàng bằng ID
router.delete("/:customerId", async (req, res) => {
    try {
        const customer = await Customer.findOne({ customerId: req.params.customerId });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        const deletedCustomer = await Customer.findOneAndDelete({ customerId: req.params.customerId });
        if (!deletedCustomer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        // Xóa khách hàng khỏi phòng
        const room = await Room.findById(customer.roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.customers.pull(customer);
        await room.save();

        res.json({ message: "Customer deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})
  
module.exports = router;