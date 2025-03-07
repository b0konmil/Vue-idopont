<template>
  <div>
    <h1>Időpont Foglalása: {{ appointmentTime }}</h1>
    <form @submit.prevent="submitBooking">
      <div class="form-group">
        <label for="name">Név:</label>
        <input v-model="name" id="name" type="text" required />
      </div>
      <div class="form-group">
        <label for="phone">Telefon:</label>
        <input v-model="phone" id="phone" type="text" required />
      </div>
      <button :disabled="!name || !phone">Foglalás</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';  
import { useAppointmentsStore } from '../stores/appointments';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

export default {
  setup() {
    const route = useRoute();
    const store = useAppointmentsStore();
    const toast = useToast();
    const router = useRouter();

    const appointmentTime = route.params.time;
    const name = ref('');
    const phone = ref('');

    const submitBooking = async () => {
      const isBooked = store.appointments.some(appointment => appointment.time === appointmentTime && appointment.booked);
      if (isBooked) {
        toast.error('Ez az időpont már foglalt!');
        return;
      }

      await store.bookAppointment(appointmentTime, name.value, phone.value);
      toast.success('Foglalás sikeresen megtörtént!');
      router.push('/');
    };

    return { appointmentTime, name, phone, submitBooking };
  }
};
</script>
