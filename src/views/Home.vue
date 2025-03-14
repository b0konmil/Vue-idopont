<template>
  <div>
    <h2>Válasszon egy szabad időpontot:</h2>
    <ul>
      <li v-for="time in availableTimes" :key="time">
        <button @click="selectTime(time)">
          {{ time }}
        </button>
      </li>
    </ul>

    <button @click="resetAvailableTimes" class="reset-button">
      Időpontok visszaállítása
    </button>

    <div v-if="state.selectedTime">
      <h3>Foglalás: {{ state.selectedTime }}</h3>
      <form @submit.prevent="submitBooking">
        <div>
          <label for="name">Név:</label>
          <input type="text" v-model="state.name" id="name" required />
        </div>
        <div>
          <label for="phone">Telefonszám:</label>
          <input type="text" v-model="state.phone" id="phone" required />
        </div>
        <button type="submit" :disabled="!state.name || !state.phone">
          Foglalás
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { useBookingStore } from '@/stores/bookings';
import { useToast } from 'vue-toastification';
import { computed, onMounted, reactive } from 'vue';

export default {
  setup() {
    const bookingStore = useBookingStore();
    const toast = useToast();

    const state = reactive({
      selectedTime: null,
      name: '',
      phone: ''
    });

    const availableTimes = computed(() => { 
      if (!bookingStore.availableTimes || bookingStore.availableTimes.length === 0) {
        console.log("Nincs elérhető időpont");
      } else {
        console.log("Elérhető időpontok:", bookingStore.availableTimes);
      }
      return bookingStore.availableTimes;
    });

    const selectTime = (time) => {
      console.log('Selected time:', time);
      state.selectedTime = time;
    };

    const submitBooking = async () => {
      console.log('Submitting booking:', state);
      if (!state.name || !state.phone) {
        toast.error("Kérjük, töltse ki az összes mezőt!");
        return;
      }
      try {
        await bookingStore.bookTimeSlot(state.name, state.phone, state.selectedTime);

        const index = bookingStore.availableTimes.indexOf(state.selectedTime);
        if (index !== -1) {
          bookingStore.availableTimes.splice(index, 1);
        }

        toast.success('Foglalás sikeres!');
      } catch (error) {
        toast.error('Hiba történt a foglalás során.');
      }
    };

    const resetAvailableTimes = async () => {
      try{
        await bookingStore.fetchAvailableTimes();
        toast.success('Az időpontok sikeresen visszaállítva!')
      } catch (error) {
        toast.error('Hiba az időpontok visszaállításakor!')
      }
    }

    onMounted(async () => {
      try {
        await bookingStore.fetchBookings();
        await bookingStore.fetchAvailableTimes();
      } catch (error) {
        toast.error("Hiba történt az adatok betöltésekor.");
      }
    });

    return {
      state,
      availableTimes,
      selectTime,
      submitBooking,
      resetAvailableTimes
    };
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  color: #333;
  line-height: 1.6;
  padding: 20px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 28px;
  margin-bottom: 20px;
  color: #2c3e50;
  text-align: center;
}

.time-list {
  list-style-type: none;
  padding: 0;
}

.time-item {
  margin: 12px 0;
}

.time-button {
  background-color: #3498db;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  font-size: 16px;
  transition: background-color 0.3s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.time-button:hover {
  background-color: #2980b9;
}

.booking-form {
  margin-top: 30px;
}

.selected-time {
  font-size: 20px;
  color: #16a085;
  margin-bottom: 20px;
  font-weight: 500;
  text-align: center;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  font-size: 16px;
  color: #34495e;
  margin-bottom: 8px;
  font-weight: 500;
}

.input {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  width: 100%;
  margin-top: 5px;
  outline: none;
  transition: border-color 0.3s;
}

.input:focus {
  border-color: #3498db;
}

.submit-button {
  background-color: #27ae60;
  color: white;
  padding: 14px;
  font-size: 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 20px;
  width: 100%;
}

.submit-button:disabled {
  background-color: #7f8c8d;
  cursor: not-allowed;
}

.submit-button:hover {
  background-color: #2ecc71;
}
</style>