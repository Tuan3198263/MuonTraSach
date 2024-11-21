<template>
  <div class="password-page-container">
    <h2 class="password-page-title">Nhập mật mã</h2>
    <input
      v-model="password"
      type="password"
      placeholder="Nhập mật mã"
      @keyup.enter="checkPassword"
      class="password-input"
    />
    <button @click="checkPassword" class="submit-button">Gửi</button>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  name: "PasswordPage",
  setup() {
    const router = useRouter();
    const password = ref("");
    const correctPassword = "1"; // Mật mã chính xác
    const errorMessage = ref("");

    // Hàm kiểm tra mật mã
    const checkPassword = () => {
      if (password.value === correctPassword) {
        router.push("/admin-login"); // Chuyển hướng đến trang đăng nhập admin nếu mật mã đúng
      } else {
        errorMessage.value = "Mật mã không đúng. Vui lòng thử lại.";
      }
    };

    return {
      password,
      checkPassword,
      errorMessage,
    };
  },
};
</script>

<style>
.password-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  width: 300px;
  margin: auto;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 170px;
}

.password-page-title {
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

.password-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
  transition: border-color 0.3s;
}

.password-input:focus {
  border-color: #007bff;
  outline: none;
}

.submit-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}
</style>
