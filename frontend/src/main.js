import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import Toastification CSS
import 'vue-toastification/dist/index.css';

// Import Toastification
import Toast, { POSITION } from 'vue-toastification';
import { createPinia } from 'pinia';








const app = createApp(App);
app.use(router);

app.use(Toast, {
  position: POSITION.TOP_RIGHT, // Chọn vị trí thông báo
  timeout: 3000, // Thời gian hiển thị thông báo (3 giây)
});
app.use(createPinia());

app.mount('#app');
