import { defineStore } from 'pinia';
import axios from 'axios';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [],
    availableTimes: []
  }),
  actions: {
    async fetchBookings() {
      try {
        const response = await axios.get('http://localhost:3000/bookings');
        this.bookings = response.data;
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    },

    async fetchAvailableTimes() {
      const availableTimes = [];
      for (let hour = 8; hour < 16; hour++) {
        const timeSlot = `2025-03-14T${String(hour).padStart(2, '0')}:00:00`;
        if (!this.bookings.some(booking => booking.date === timeSlot)) {
          availableTimes.push(timeSlot);
        }
      }
      this.availableTimes = availableTimes;
    },

    async bookTimeSlot(name, phone, date) {
      const newBooking = { name, phone, date };
      try {
        await axios.post('http://localhost:3000/bookings', newBooking);
        this.bookings.push(newBooking);
      } catch (error) {
        console.error("Error booking time slot:", error);
      }
    }
  }
});
