<template>
  <div class="register-form mt-5 mb-5">
    <h2 class="text-center mb-4">Đăng Ký Tài Khoản</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Họ và Tên -->
      <div class="mb-3 d-flex">
        <div class="me-2 flex-grow-1">
          <label for="firstName" class="form-label">
            <i class="fas fa-user"></i> Họ
          </label>
          <input
            type="text"
            class="form-control"
            id="firstName"
            v-model="firstName"
            placeholder="Nhập họ"
            required
          />
        </div>
        <div class="flex-grow-1">
          <label for="lastName" class="form-label">
            <i class="fas fa-user"></i> Tên
          </label>
          <input
            type="text"
            class="form-control"
            id="lastName"
            v-model="lastName"
            placeholder="Nhập tên"
            required
          />
        </div>
      </div>

      <!-- Ngày sinh -->
      <div class="mb-3">
        <label for="dob" class="form-label">
          <i class="fas fa-calendar-alt"></i> Ngày sinh
        </label>
        <input
          type="date"
          class="form-control"
          id="dob"
          v-model="dob"
          required
        />
      </div>

      <!-- Giới tính -->
      <div class="mb-3">
        <label for="gender" class="form-label">
          <i class="fas fa-transgender-alt"></i> Giới tính
        </label>
        <select class="form-control" id="gender" v-model="gender" required>
          <option value="" disabled>Chọn giới tính</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
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
        <p>Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
      </div>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { useToast } from "vue-toastification";
export default {
  name: "RegisterForm",
  setup() {
    // Sử dụng toast
    const toast = useToast();

    // Khai báo các trường dữ liệu
    const firstName = ref("");
    const lastName = ref("");
    const dob = ref("");
    const gender = ref("");
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
        Ho: firstName.value,
        Ten: lastName.value,
        NgaySinh: dob.value,
        GioiTinh: gender.value,
        DiaChi: address.value,
        Sdt: phone.value,
        Password: password.value,
      };

      try {
        const response = await fetch(
          "http://localhost:3000/api/docGia/register",
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
          firstName.value = "";
          lastName.value = "";
          dob.value = "";
          gender.value = "";
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
      firstName,
      lastName,
      dob,
      gender,
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
.register-form {
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

.d-flex .form-control {
  margin-right: 10px;
}

.mb-3 i {
  margin-right: 8px;
}
</style>
