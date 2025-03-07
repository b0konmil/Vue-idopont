import { defineStore } from 'pinia';
import axios from 'axios';

export const useAppointmentsStore = defineStore({
  id: 'appointments',
  state: () => ({
    appointments: [],
  }),
  actions: {
    async fetchAppointments() {
      try {
        const response = await axios.get('http://localhost:3000/appointments');
        this.appointments = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async bookAppointment(time, name, phone) {
      try {
        await axios.post('http://localhost:3000/appointments', {
          time,
          booked: true,
          name,
          phone
        });
        this.fetchAppointments();
      } catch (error) {
        console.error(error);
      }
    },
  }
});
