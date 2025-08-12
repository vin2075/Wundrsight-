const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { auth, requireRole } = require('../middleware/auth'); // ✅ Adjust path if needed
const prisma = new PrismaClient();
const router = express.Router();

console.log("Booking routes loaded");

// Patient booking
/*router.post('/book', auth, async (req, res) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Only patients can book' } });
  }

  const { slotId } = req.body;
  if (!slotId) {
    return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'slotId required' } });
  }

  const startAt = new Date(slotId);
  if (isNaN(startAt)) {
    return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Invalid slotId' } });
  }

  const endAt = new Date(startAt.getTime() + 30 * 60 * 1000);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      let slot = await tx.slot.findUnique({
        where: { startAt_endAt: { startAt, endAt } }
      }).catch(() => null);

      if (!slot) {
        slot = await tx.slot.create({ data: { startAt, endAt } });
      }

      return await tx.booking.create({ data: { userId: req.user.id, slotId: slot.id } });
    });

    res.status(201).json({ id: booking.id });
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(409).json({ error: { code: 'SLOT_TAKEN', message: 'Slot already taken' } });
    }
    return res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Could not book' } });
  }
});
*/

router.post('/book', auth, async (req, res) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'Only patients can book' } });
  }

  const { slotId } = req.body;
  if (!slotId) {
    return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'slotId required' } });
  }

  const startAt = new Date(slotId);
  if (isNaN(startAt)) {
    return res.status(400).json({ error: { code: 'INVALID_INPUT', message: 'Invalid slotId' } });
  }

  const endAt = new Date(startAt.getTime() + 30 * 60 * 1000);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // Find or create the slot
      const slot = await tx.slot.upsert({
        where: { startAt_endAt: { startAt, endAt } },
        update: {},
        create: { startAt, endAt }
      });

      // Try to create booking
      return await tx.booking.create({
        data: { userId: req.user.id, slotId: slot.id }
      });
    });

    res.status(201).json({ id: booking.id });
  } catch (e) {
    if (e.code === 'P2002') {
      // Prisma unique constraint error
      return res.status(409).json({ error: { code: 'SLOT_TAKEN', message: 'Slot already taken' } });
    }
    console.error(e);
    res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Could not book' } });
  }
});


// My bookings (patient only)
router.get('/my-bookings', auth, requireRole('patient'), async (req, res) => {
  const bookings = await prisma.booking.findMany({
    where: { userId: req.user.id },
    include: { slot: true }
  });
  res.json(bookings);
});

// All bookings (admin only)
router.get('/all-bookings', auth, requireRole('admin'), async (req, res) => {
  const bookings = await prisma.booking.findMany({
    include: { slot: true, user: true }
  });
  res.json(bookings);
});

module.exports = router;
