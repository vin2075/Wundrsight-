import React, { useEffect, useState } from 'react';
import api from '../api';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    const res = await api.get('/all-bookings');
    setBookings(res.data);
  }

  return (
    <div>
      <h2>All Bookings</h2>
      <ul>
        {bookings.map((b) => (
          <li key={b.id}>
            {new Date(b.slot.startAt).toLocaleString()} - {b.user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}
