<template>
  <div class="sidebar d-flex flex-column p-3">
    <h4>Thư viện</h4>
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <router-link to="/" class="nav-link">
          <i class="fas fa-home"></i> Trang chủ
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin" class="nav-link">
          <i class="fas fa-tachometer"></i> Tổng quan
        </router-link>
      </li>

      <li class="nav-item">
        <router-link to="/admin/books" class="nav-link">
          <i class="fas fa-book"></i> Sách
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/publishers" class="nav-link">
          <i class="fas fa-building"></i> Nhà xuất bản
        </router-link>
      </li>

      <li class="nav-item">
        <router-link to="/admin/book-loan" class="nav-link">
          <i class="fas fa-exchange-alt"></i> Mượn trả
        </router-link>
      </li>
      <li class="nav-item">
        <router-link to="/admin/readers" class="nav-link">
          <i class="fas fa-users"></i> Bạn đọc
        </router-link>
      </li>

      <!-- Nút Hồ sơ -->
      <li class="nav-item">
        <router-link to="/admin/profile" class="nav-link">
          <i class="fas fa-user-circle"></i> Hồ sơ Admin
        </router-link>
      </li>

      <!-- Thêm nút Logout ở đây -->
      <li class="nav-item">
        <button @click="logout" class="nav-link btn-logout">
          <i class="fas fa-sign-out-alt"></i> Đăng xuất
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useAdminAuthStore } from "../../stores/useAdminAuthStore"; // Giả sử bạn có store quản lý đăng nhập quản trị viên

export default {
  name: "SidebarAdmin",
  setup() {
    const router = useRouter();
    const adminAuthStore = useAdminAuthStore();
    const toast = useToast();
    const logout = () => {
      const isConfirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");

      if (isConfirmed) {
        adminAuthStore.adminLogout(); // Gọi phương thức logout từ store
        router.push("/admin-login"); // Chuyển hướng đến trang đăng nhập

        // Hiển thị thông báo thành công bằng Toast
        toast.success("Đăng xuất thành công!");
      }
    };

    return {
      logout,
    };
  },
};
</script>

<style scoped>
.sidebar {
  width: 250px;
  background-color: #2c3e50;
  color: #ecf0f1;
  height: 100vh;
  position: fixed;
  transition: all 0.3s;
  padding-top: 20px; /* Đảm bảo có khoảng cách cho tiêu đề */
}
.sidebar h4 {
  padding: 15px;
  text-align: center;
  font-size: 1.5rem;
  color: #ecf0f1;
  border-bottom: 1px solid #34495e;
  font-weight: bold;
}
.sidebar .nav-link {
  color: #bdc3c7;
  font-size: 1.1rem;
  padding: 12px 20px;
  transition: background-color 0.3s, color 0.3s;
}
.sidebar .nav-link:hover,
.sidebar .nav-link.active {
  background-color: #34495e;
  color: #ecf0f1;
}
.sidebar .nav-link i {
  margin-right: 10px;
  font-size: 1.2rem;
}
.sidebar .nav-link.active i {
  color: #3498db;
}
</style>
