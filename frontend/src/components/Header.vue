<template>
  <!-- Header Section -->
  <header class="bg-primary text-white">
    <nav class="navbar navbar-expand-lg navbar-dark">
      <div class="container-fluid">
        <!-- Logo -->
        <router-link to="/">
          <i class="fas fa-book-open" style="font-size: 40px; color: white"></i>
        </router-link>

        <!-- Toggle button for mobile view -->
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Search bar, Find Books button, Mystery icon, and Login button -->
        <div
          class="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <!-- Search bar -->
          <form class="d-flex me-3" role="search">
            <div class="input-group">
              <input
                class="form-control"
                type="search"
                placeholder="Search for books or comics"
                aria-label="Search"
              />
              <button class="btn btn-outline-light" type="submit">
                <i class="fas fa-search"></i>
              </button>
            </div>
          </form>
          <!-- Mystery icon -->
          <router-link
            to="/enter-password"
            class="btn btn-light me-2"
            title="Bí ẩn"
          >
            <i class="fas fa-question-circle"></i>
          </router-link>

          <!-- Find Books button -->
          <router-link to="/book" class="btn btn-light me-2">
            <i class="fas fa-book"></i> Tìm sách
          </router-link>

          <!-- Thông báo chuông -->
          <button
            v-if="authStore.isLoggedIn"
            class="btn btn-light me-2 position-relative"
            title="Thông báo"
            @click="toggleNotifications"
          >
            <i class="fas fa-bell notification-bell"></i>
          </button>

          <!-- Bảng thông báo (Modal) -->
          <div
            v-if="showNotifications"
            class="notification-modal position-absolute bg-white p-3 shadow-lg"
            style="
              top: 60px;
              right: 20px;
              width: 300px;
              max-height: 400px;
              overflow-y: auto;
            "
          >
            <h5 class="mb-3">Thông báo</h5>
            <ul class="list-group">
              <li
                v-for="(notification, index) in notifications"
                :key="index"
                class="list-group-item notification-item"
              >
                <div class="notification-message">
                  {{ notification.message }}
                </div>
                <div class="notification-date">
                  {{ formatDate(notification.createdAt) }}
                </div>
              </li>
            </ul>
            <button
              class="btn btn-sm btn-secondary mt-3"
              @click="toggleNotifications"
            >
              Đóng
            </button>
          </div>

          <!-- Login/User icon -->
          <div v-if="authStore.isLoggedIn">
            <router-link to="/profile" class="btn btn-light me-2">
              <i class="fas fa-user"></i> Tài khoản
            </router-link>
            <button @click="handleLogout" class="btn btn-light">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
          <div v-else>
            <router-link to="/login" class="btn btn-light">
              <i class="fas fa-sign-in-alt"></i> Đăng nhập
            </router-link>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { ref } from "vue"; // Import `ref` from Vue
import { useAuthStore } from "../stores/useAuthStore";
import { useRouter } from "vue-router"; // Import useRouter
import { useToast } from "vue-toastification";

export default {
  name: "Header",
  setup() {
    const toast = useToast();
    const authStore = useAuthStore();
    const router = useRouter(); // Initialize the router

    const showNotifications = ref(false);
    const notifications = ref([]);

    // Phương thức xử lý đăng xuất
    const handleLogout = () => {
      const isConfirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
      if (isConfirmed) {
        authStore.logout(); // Đăng xuất người dùng khỏi store
        router.push("/"); // Chuyển hướng đến trang đăng nhập
        toast.success("Đăng xuất thành công!"); // Hiển thị thông báo toast thành công
      }
    };

    // Toggle bảng thông báo
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
      if (showNotifications.value) {
        fetchNotifications();
      }
    };

    // Lấy thông báo từ API bằng fetch
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/notifications",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${authStore.token}`, // Thêm token vào header
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          notifications.value = data; // Gán dữ liệu thông báo
        } else {
          toast.error("Lỗi khi tải thông báo!");
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
        toast.error("Lỗi khi tải thông báo!");
      }
    };

    // Format Date: Chuyển đổi thời gian ISO thành định dạng dễ đọc
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      return date.toLocaleDateString("vi-VN", options); // Định dạng ngày giờ theo tiếng Việt
    };

    return {
      authStore,
      handleLogout,
      toggleNotifications,
      showNotifications,
      notifications,
      formatDate, // Trả về hàm formatDate cho template
    };
  },
};
</script>

<style scoped>
.notification-modal {
  z-index: 9999;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  width: 300px;
  overflow-y: auto; /* Enable scrolling if the list is too long */
  padding: 10px;
}

.notification-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.notification-item:last-child {
  border-bottom: none;
}

.notification-message {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  font-weight: 500; /* Thêm thuộc tính font-weight để làm cho thông điệp đậm hơn */
}

.notification-date {
  font-size: 12px;
  color: #888;
  text-align: right;
}

.notification-item:hover {
  background-color: #f8f9fa;
  cursor: pointer;
}

.notification-modal h5 {
  font-size: 16px;
  margin-bottom: 15px;
  font-weight: 600;
  color: #333;
}

.notification-modal .btn {
  width: 100%;
}

@media (max-width: 768px) {
  .notification-modal {
    width: 250px;
    top: 70px;
  }
}
.notification-date {
  font-size: 12px;
  color: #888;
  text-align: right;
  margin-top: 5px;
}

.notification-bell {
  position: relative;
}

/* Hiển thị thông báo tượng trưng bằng cách tạo một chấm đỏ */
.notification-bell::after {
  content: "";
  position: absolute;
  top: -3px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: red;
  display: block;
}
</style>
