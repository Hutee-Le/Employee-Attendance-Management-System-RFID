const express = require('express');
const router = express.Router();
const Device = require('../models/Device');
const Room = require('../models/Room')

// Lấy tất cả các thiết bị
router.get("/getAllDevices", async (req, res) => {
    try {
        const devices = await Device.find().populate('roomId');
        res.json(devices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy thiết bị bằng id
router.get('/:id', async (req, res) => {
    try {
      const device = await Device.findById(req.params.id).populate('roomId');
      if (!device) {
        return res.status(404).json({ message: 'Device not found' });
      }
      return res.json(device);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

// Tạo mới một thiết bị
router.post("/addDevice", async (req, res) => {
    try {
        const device = new Device({
            deviceName: req.body.deviceName,
            icon: req.body.icon,
            status: req.body.status,
            roomId: req.body.roomId
        });
        // Lấy thông tin phòng
        const room = await Room.findById(req.body.roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        // Thêm thiết bị vào phòng
        room.devices.push(device);
        await room.save();
        // Lưu thiết bị
        const newDevice = await device.save();
        res.status(201).json(newDevice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật thông tin của một thiết bị bằng ID
router.put("/updateDevice/:id", async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }
        if (req.body.deviceName != null) {
            device.deviceName = req.body.deviceName;
        }
        if (req.body.icon != null) {
            device.icon = req.body.icon;
        }
        if (req.body.status != null) {
            device.status = req.body.status;
        }
        if (req.body.isOn != null) {
            device.isOn = req.body.isOn;
        }
        const updatedDevice = await device.save();
        res.json(updatedDevice);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//   Xoá một thiết bị bằng ID
router.delete("/deleteDevice/:id", async (req, res) => {
    try {
        const device = await Device.findById(req.params.id);
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        const deletedDevice = await Device.findOneAndDelete(req.params.id);
        if (!deletedDevice) {
            return res.status(404).json({ message: "Device not found" });
        }
        const room = await Room.findById(device.roomId);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }
        room.devices.pull(device);
        await room.save();
        res.status(201).json({ message: "Deleted device" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;