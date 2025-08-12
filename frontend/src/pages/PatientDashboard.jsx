import React, { useEffect, useState } from 'react';
import api from '../api';

export default function PatientDashboard() {
  const [slots, setSlots] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSlots();
    fetchBookings();
  }, []);

  async function fetchSlots() {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const res = await api.get(`/slots?from=${today}&to=${today}`);
      setSlots(res.data);
    } catch {
      setError('Failed to load slots');
    }
  }

  async function fetchBookings() {
    try {
      const res = await api.get('/my-bookings');
      setMyBookings(res.data);
    } catch {}
  }

  async function book(slot) {
    try {
      await api.post('/book', { slotId: slot.startAt });
      alert('Booked!');
      fetchSlots();
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Booking failed');
    }
  }

  return (
    <div>
<div className="card">
  <h2>Available Slots</h2>
  <ul>
    {slots.map((s) => (
      <li key={s.startAt}>
        {new Date(s.startAt).toLocaleString()} -{" "}
        {s.available ? <button onClick={() => book(s)}>Book</button> : "Taken"}
      </li>
    ))}
  </ul>
</div>

<div className="card">
  <h2>My Bookings</h2>
  <ul>
    {myBookings.map((b) => (
      <li key={b.id}>{new Date(b.slot.startAt).toLocaleString()}</li>
    ))}
  </ul>
</div>
</div>
  );
}
