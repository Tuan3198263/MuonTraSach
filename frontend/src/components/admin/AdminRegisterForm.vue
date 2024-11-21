<template>
  <div class="admin-register-form mt-5 mb-5">
    <h2 class="text-center mb-4">Đăng ký tài khoản quản trị</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Họ và Tên -->
      <div class="mb-3">
        <label for="fullName" class="form-label">
          <i class="fas fa-user"></i> Họ và Tên
        </label>
        <input
          type="text"
          class="form-control"
          id="fullName"
          v-model="fullName"
          placeholder="Nhập họ và tên"
          required
        />
      </div>

      <!-- Chức vụ -->
      <div class="mb-3">
        <label for="role" class="form-label">
          <i class="fas fa-briefcase"></i> Chức vụ
        </label>
        <input
          type="text"
          class="form-control"
          id="role"
          v-model="role"
          placeholder="Nhập chức vụ"
          required
        />
      </div>

      <!-- Địa chỉ -->
      <div class="mb-3">
        <label for="address" class="form-label">
          <i class="fas fa-map-marker-alt"></i> Địa chỉ
        </label>
        <input
          type="text"
          class="form-control"
          id="address"
          v-model="address"
          placeholder="Nhập địa chỉ"
          required
        />
      </div>

      <!-- Số điện thoại -->
      <div class="mb-3">
        <label for="phone" class="form-label">
          <i class="fas fa-phone"></i> Số điện thoại
        </label>
        <input
          type="tel"
          class="form-control"
          id="phone"
          v-model="phone"
          placeholder="Nhập số điện thoại"
          required
        />
      </div>

      <!-- Mật khẩu -->
      <div class="mb-3">
        <label for="password" class="form-label">
          <i class="fas fa-lock"></i> Mật khẩu
        </label>
        <input
          type="password"
          class="form-control"
          id="password"
          v-model="password"
          placeholder="Nhập mật khẩu"
          required
        />
      </div>

      <!-- Nhập lại mật khẩu -->
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">
          <i class="fas fa-lock"></i> Nhập lại mật khẩu
        </label>
        <input
          type="password"
          class="form-control"
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="Nhập lại mật khẩu"
          required
        />
      </div>

      <!-- Nút đăng ký -->
      <button type="submit" class="btn btn-primary w-100">Đăng Ký</button>

      <!-- Mục đã có tài khoản -->
      <div class="text-center mt-3">
        <p>
          Đã có tài khoản?
          <router-link to="/admin-login">Đăng nhập</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useToast } from "vue-toastification";

export default {
  name: "AdminRegisterForm",
  setup() {
    // Sử dụng toast
    const toast = useToast();

    // Khai báo các trường dữ liệu
    const fullName = ref("");
    const role = ref("");
    const address = ref("");
    const phone = ref("");
    const password = ref("");
    const confirmPassword = ref("");

    // Phương thức xử lý khi form được submit
    const handleSubmit = async () => {
      // Kiểm tra nếu mật khẩu và nhập lại mật khẩu khớp
      if (password.value !== confirmPassword.value) {
        toast.error("Mật khẩu và nhập lại mật khẩu không khớp.");
        return;
      }

      // Kiểm tra số điện thoại
      const phoneRegex = /^0\d{8,10}$/; // Số điện thoại phải bắt đầu bằng 0 và có từ 9 đến 11 chữ số
      if (!phoneRegex.test(phone.value)) {
        toast.error(
          "Số điện thoại không hợp lệ. Phải bắt đầu bằng 0 và có từ 9 đến 11 chữ số."
        );
        return;
      }

      // Dữ liệu gửi đến API
      const data = {
        HoTenNv: fullName.value,
        ChucVu: role.value,
        DiaChi: address.value,
        Sdt: phone.value,
        Password: password.value,
      };

      try {
        const response = await fetch(
          "http://localhost:3000/api/nhanVien/register",
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
          toast.success("Đăng ký thành công!");

          // Sau khi đăng ký thành công, làm sạch các trường nhập liệu
          fullName.value = "";
          role.value = "";
          address.value = "";
          phone.value = "";
          password.value = "";
          confirmPassword.value = "";
        } else {
          toast.error("Đã xảy ra lỗi: " + result.message);
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi gửi yêu cầu:", error);
        toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
      }
    };

    // Trả về các biến và phương thức từ setup
    return {
      fullName,
      role,
      address,
      phone,
      password,
      confirmPassword,
      handleSubmit,
    };
  },
};
</script>

<style scoped>
.admin-register-form {
  max-width: 600px;
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

button {
  margin-top: 20px;
}

.text-center {
  text-align: center;
}

.mb-3 i {
  margin-right: 8px;
}
</style>
