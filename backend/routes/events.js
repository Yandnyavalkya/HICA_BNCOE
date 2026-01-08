import express from 'express';
import Event from '../models/Event.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Create event (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ detail: error.message });
    }
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Update event (admin only)
router.put('/:event_id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.event_id);
    if (!event) {
      return res.status(404).json({ detail: 'Event not found' });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Delete event (admin only)
router.delete('/:event_id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.event_id);
    if (!event) {
      return res.status(404).json({ detail: 'Event not found' });
    }

    await event.deleteOne();
    res.json({ detail: 'Deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

export default router;
