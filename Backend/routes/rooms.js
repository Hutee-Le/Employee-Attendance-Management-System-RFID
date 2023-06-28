const express = require('express');
const router = express.Router();
const Room = require('../models/Room')

router.get("/", async (req, res) => {
    try {
      const rooms = await Room.find().populate('devices');
      res.status(200).json(rooms);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const room = await Room.findById(req.params.id).populate('devices');
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      return res.json(room);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });

  router.post("/", async (req, res) => {
    const room = new Room({
      name: req.body.name,
      desc: req.body.desc,
    });
    try {
      const newRoom = await room.save();
      res.status(201).json(newRoom);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.status(200).json(updatedRoom);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await Room.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Deleted room" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

module.exports = router;