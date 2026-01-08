import express from 'express';
import SiteConfig from '../models/SiteConfig.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get site config
router.get('/', async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = new SiteConfig();
      await config.save();
    }
    res.json([config]);
  } catch (error) {
    console.error('Error fetching site config:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Create site config (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const existing = await SiteConfig.findOne();
    if (existing) {
      return res.status(400).json({ detail: 'Config already exists. Use PUT to update.' });
    }

    const config = new SiteConfig(req.body);
    await config.save();
    res.json(config);
  } catch (error) {
    console.error('Error creating site config:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Update site config (admin only)
router.put('/:config_id', authenticateToken, async (req, res) => {
  try {
    const config = await SiteConfig.findById(req.params.config_id);
    if (!config) {
      return res.status(404).json({ detail: 'Config not found' });
    }

    Object.assign(config, req.body);
    await config.save();
    res.json(config);
  } catch (error) {
    console.error('Error updating site config:', error);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

export default router;
