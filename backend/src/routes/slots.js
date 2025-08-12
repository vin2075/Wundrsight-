const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { addDays } = require('date-fns');

const prisma = new PrismaClient();
const router = express.Router();

// GET /api/slots?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/slots', async (req, res) => {
  try {
    const { from, to } = req.query;
    const startDate = from ? new Date(from + 'T00:00:00Z') : new Date();
    const endDate = to ? new Date(to + 'T00:00:00Z') : addDays(startDate, 7);
    const slots = [];

    for (let d = new Date(startDate); d <= endDate; d = addDays(d, 1)) {
      for (let hour = 9; hour < 17; hour++) {
        for (let m = 0; m < 60; m += 30) {
          const s = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), hour, m));
          const e = new Date(s.getTime() + 30 * 60 * 1000);
          slots.push({ startAt: s, endAt: e });
        }
      }
    }

    const booked = await prisma.booking.findMany({ include: { slot: true }});
    const bookedSet = new Set(booked.map(b => b.slot.startAt.toISOString()));

    const available = slots.map(s => ({
      startAt: s.startAt.toISOString(),
      endAt: s.endAt.toISOString(),
      available: !bookedSet.has(s.startAt.toISOString())
    }));

    res.json(available);
  } catch (e) {
    console.error('Slots error:', e);
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Could not load slots' }});
  }
});

module.exports = router;
