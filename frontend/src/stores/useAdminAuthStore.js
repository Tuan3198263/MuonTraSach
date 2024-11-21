// src/stores/useAdminAuthStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAdminAuthStore = defineStore('adminAuth', () => {
  const adminToken = ref(null);
  const isAdminLoggedIn = ref(false);

  // Lưu token vào localStorage và cập nhật trạng thái đăng nhập
  const setAdminAuth = (newAdminToken) => {
    adminToken.value = newAdminToken;
    isAdminLoggedIn.value = true;
    localStorage.setItem('adminToken', newAdminToken); // Lưu token vào localStorage
  };

  // Xóa token và cập nhật trạng thái đăng xuất
  const adminLogout = () => {
    adminToken.value = null;
    isAdminLoggedIn.value = false;
    localStorage.removeItem('adminToken'); // Xóa token khỏi localStorage
  };

  // Kiểm tra xem quản trị viên đã đăng nhập chưa
  const loadAdminAuth = () => {
    const savedAdminToken = localStorage.getItem('adminToken');
    if (savedAdminToken) {
      adminToken.value = savedAdminToken;
      isAdminLoggedIn.value = true;
    }
  };

  // Gọi loadAdminAuth khi store được khởi tạo
  loadAdminAuth();

  // Kiểm tra token hợp lệ (Optional)
  const isAdminTokenValid = () => {
    return adminToken.value !== null;
  };

  return {
    adminToken,
    isAdminLoggedIn,
    setAdminAuth,
    adminLogout,
    loadAdminAuth,
    isAdminTokenValid,
  };
});
