require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const slotRoutes = require('./routes/slots');
const seed = require('../prisma/seed');

const prisma = new PrismaClient();
const app = express();

// Debug every incoming request
app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.url}`);
  next();
});

app.use(helmet());
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || '*'
}));

// Root health check
app.get('/', (req, res) => {
  res.json({ status: "ok", message: "API running. Use /api/* endpoints" });
});

// API Routes
app.use('/api', authRoutes);
app.use('/api', slotRoutes);
app.use('/api', bookingRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await seed();
    console.log('Seed complete');
  } catch (e) {
    console.error('Seed error', e);
  }
});
