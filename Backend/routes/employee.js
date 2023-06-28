const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');



// Route: Lấy danh sách nhân viên
router.get('/getAllEmployees', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

// Route: Lấy thông tin nhân viên theo ID
router.get('/getEmployeeById/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Không tìm thấy nhân viên' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
});

// Route: Tạo nhân viên mới
router.post('/addEmployee', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.json(employee);
    } catch (error) {
        res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
    }
});

// Route: Cập nhật thông tin nhân viên
router.put('/updateEmployee/:id', async (req, res) => {
    try {
      const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.json(employee);
    } catch (error) {
      res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
    }
  });

// Route: Xóa nhân viên
router.delete('/deleteEmployee/:id', async (req, res) => {
    try {
        await Employee.findByIdAndRemove(req.params.id);
        res.json({ message: 'Đã xóa nhân viên' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});


// Route: Cập nhật danh sách nhân viên
router.put('/updateEmployees', async (req, res) => {
    try {
      const employeeData = req.body;
    
      // Lặp qua danh sách nhân viên và cập nhật từng nhân viên
      const updatePromises = employeeData.map(async (employee) => {
        const { rfid } = employee;
        const updateData = { ...employee };
        delete updateData.rfid; // Loại bỏ trường rfid khỏi dữ liệu cập nhật
        const updatedEmployee = await Employee.findOneAndUpdate({ rfid }, updateData, {
          new: true,
        });
        return updatedEmployee;
      });
    
      // Đợi tất cả các truy vấn cập nhật hoàn thành
      const updatedEmployees = await Promise.all(updatePromises);
    
      res.json(updatedEmployees);
    } catch (error) {
      res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
    }
  });

module.exports = router;