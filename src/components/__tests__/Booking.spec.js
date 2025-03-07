import { mount } from '@vue/test-utils';
import Booking from '../views/Booking.vue';

test('submit booking form', async () => {
  const wrapper = mount(Booking);
  await wrapper.find('input#name').setValue('József Varga');
  await wrapper.find('input#phone').setValue('123456789');
  await wrapper.find('form').trigger('submit.prevent');

  expect(wrapper.text()).toContain('Foglalás sikeresen megtörtént!');
});
