import express from 'express';
import TeamMember from '../models/TeamMember.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all team members
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find().sort({ order: 1 });
    res.json(members);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Create team member (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const member = new TeamMember(req.body);
    await member.save();
    res.json(member);
  } catch (error) {
    console.error('Error creating team member:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ detail: error.message });
    }
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Update team member (admin only)
router.put('/:member_id', authenticateToken, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.member_id);
    if (!member) {
      return res.status(404).json({ detail: 'Team member not found' });
    }

    Object.assign(member, req.body);
    await member.save();
    res.json(member);
  } catch (error) {
    console.error('Error updating team member:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Delete team member (admin only)
router.delete('/:member_id', authenticateToken, async (req, res) => {
  try {
    const member = await TeamMember.findById(req.params.member_id);
    if (!member) {
      return res.status(404).json({ detail: 'Team member not found' });
    }

    await member.deleteOne();
    res.json({ detail: 'Deleted' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

export default router;
