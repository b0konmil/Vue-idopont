import { mount } from '@vue/test-utils';
import Home from '@/views/Home.vue';
import { createTestingPinia } from '@pinia/testing';
import { nextTick } from 'vue';

jest.mock('vue-toastification', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
  }),
}));

describe('Home.vue', () => {
  let wrapper;

  beforeEach(() => {
    const pinia = createTestingPinia();
    wrapper = mount(Home, {
      global: {
        plugins: [pinia],
      },
    });
  });

  it('Időpontok helyes betöltése', async () => {
    const bookingStore = useBookingStore();
    bookingStore.availableTimes = [
      '2025-03-14T08:00:00',
      '2025-03-14T09:00:00',
    ];

    await nextTick();

    const timeButtons = wrapper.findAll('button');
    expect(timeButtons.length).toBe(2);
    expect(timeButtons[0].text()).toBe('2025-03-14T08:00:00');
    expect(timeButtons[1].text()).toBe('2025-03-14T09:00:00');
  });

  it('Kiválasztott időpont frissítése', async () => {
    const bookingStore = useBookingStore();
    bookingStore.availableTimes = [
      '2025-03-14T08:00:00',
      '2025-03-14T09:00:00',
    ];

    const timeButtons = wrapper.findAll('button');
    await timeButtons[0].trigger('click');

    expect(wrapper.vm.state.selectedTime).toBe('2025-03-14T08:00:00');
  });
});
