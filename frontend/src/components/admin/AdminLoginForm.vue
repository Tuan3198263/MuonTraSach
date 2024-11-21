<template>
  <div class="login-form mt-5 mb-5">
    <h2 class="text-center mb-4">Đăng nhập quản trị viên</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Số điện thoại -->
      <div class="mb-3">
        <div class="input-group">
          <span class="input-group-text">
            <i class="fas fa-phone-alt"></i>
          </span>
          <input
            type="tel"
            class="form-control"
            id="phone"
            v-model="phone"
            placeholder="Nhập số điện thoại"
            required
          />
        </div>
      </div>

      <!-- Mật khẩu -->
      <div class="mb-3">
        <div class="input-group">
          <span class="input-group-text">
            <i class="fas fa-lock"></i>
          </span>
          <input
            :type="showPassword ? 'text' : 'password'"
            class="form-control"
            id="password"
            v-model="password"
            placeholder="Nhập mật khẩu"
            required
          />
          <!-- Icon để ẩn/hiện mật khẩu -->
          <span
            class="input-group-text cursor-pointer"
            @click="togglePasswordVisibility"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </span>
        </div>
      </div>

      <!-- Nút đăng nhập -->
      <button type="submit" class="btn btn-primary w-100 mt-5">
        Đăng nhập
      </button>

      <!-- Liên kết đăng ký -->
      <div class="text-center mt-3">
        <span>Chưa có tài khoản? </span>
        <router-link to="/admin-register" class="text-decoration-none">
          Đăng ký ngay
        </router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useToast } from "vue-toastification"; // Đảm bảo đã cài vue-toastification
import { useAdminAuthStore } from "../../stores/useAdminAuthStore"; // Import store quản trị viên
import { useRouter } from "vue-router";

export default {
  name: "AdminLoginForm",
  setup() {
    const phone = ref("");
    const password = ref("");
    const showPassword = ref(false);
    const loading = ref(false);
    const toast = useToast();
    const adminAuthStore = useAdminAuthStore(); // Sử dụng store quản trị viên
    const router = useRouter(); // Khởi tạo router

    // Phương thức để chuyển đổi trạng thái ẩn/hiện mật khẩu
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value;
    };

    // Phương thức xử lý khi form được submit
    const handleSubmit = async () => {
      const data = {
        Sdt: phone.value,
        Password: password.value,
      };

      loading.value = true;

      try {
        const response = await fetch(
          "http://localhost:3000/api/nhanVien/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        const result = await response.json();

        if (response.ok) {
          // Lấy token từ kết quả phản hồi và lưu vào localStorage
          const token = result.token; // Lấy token từ API response
          localStorage.setItem("adminToken", token); // Lưu token vào localStorage

          adminAuthStore.setAdminAuth(result.token); // Cập nhật thông tin đăng nhập

          toast.success("Đăng nhập thành công!");

          // Đảm bảo store đã cập nhật và chuyển hướng đến trang admin
          if (adminAuthStore.isAdminLoggedIn) {
            router.push("/admin"); // Chuyển hướng sau khi đăng nhập thành công
          } else {
            toast.error("Đăng nhập không thành công. Vui lòng thử lại.");
          }
        } else {
          toast.error(
            result.message || "Đăng nhập thất bại. Vui lòng thử lại."
          );
        }
      } catch (error) {
        console.error("Có lỗi xảy ra:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại.");
      } finally {
        loading.value = false;
      }
    };

    return {
      phone,
      password,
      showPassword,
      handleSubmit,
      togglePasswordVisibility,
      loading,
    };
  },
};
</script>

<style scoped>
.login-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

h2 {
  font-size: 1.5rem;
  font-weight: bold;
}

.input-group-text {
  background-color: #f0f0f0;
}

button {
  margin-top: 20px;
}

.text-center {
  text-align: center;
}

.router-link {
  color: #007bff;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
