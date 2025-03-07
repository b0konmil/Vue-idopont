<template>
  <div>
    <h1>Elérhető Időpontok</h1>
    <ul>
      <li v-for="appointment in availableAppointments" :key="appointment.id">
        <button v-if="!appointment.booked" @click="goToBooking(appointment.time)">
          {{ appointment.time }}
        </button>
        <span v-else>Foglalva</span>
      </li>
    </ul>
  </div>
</template>

<script>
import { useAppointmentsStore } from '../stores/appointments';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  setup() {
    const store = useAppointmentsStore();
    const router = useRouter();

    store.fetchAppointments();

    const availableAppointments = computed(() => {
      return store.appointments.filter(appointment => !appointment.booked);
    });

    const goToBooking = (time) => {
      router.push(`/booking/${time}`);
    };

    return { availableAppointments, goToBooking };
  }
};
</script>
