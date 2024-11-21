<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <SidebarAdmin />

    <!-- Nội dung chính -->
    <div class="content flex-grow-1 p-3">
      <!-- Tiêu đề trang -->
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Thông Tin Quản Trị Viên</h4>
      </div>

      <!-- Hiển thị trạng thái tải dữ liệu -->
      <div v-if="loading" class="loading">Đang tải...</div>
      <div v-if="error" class="error">{{ error }}</div>

      <!-- Hiển thị thông tin quản trị viên -->
      <div v-if="admin" class="admin-info">
        <h5>MSNV: {{ admin.MSNV }}</h5>
        <h5>Tên: {{ admin.HoTenNv }}</h5>

        <p>Chức vụ: {{ admin.ChucVu }}</p>
        <p>Địa chỉ: {{ admin.DiaChi }}</p>
        <p>Số điện thoại: {{ admin.Sdt }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import SidebarAdmin from "./SidebarAdmin.vue";

export default {
  components: {
    SidebarAdmin,
  },
  setup() {
    const admin = ref(null);
    const loading = ref(true);
    const error = ref(null);

    const fetchAdminInfo = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        error.value = "Không có token, vui lòng đăng nhập lại.";
        loading.value = false;
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/nhanVien/ho-so-nhan-vien",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Không thể lấy thông tin quản trị viên");
        }

        const data = await response.json();
        admin.value = data.nhanVien;
        loading.value = false;
      } catch (err) {
        console.error(err); // In lỗi ra để kiểm tra
        error.value = err.message;
        loading.value = false;
      }
    };
    onMounted(() => {
      fetchAdminInfo();
    });

    return {
      admin,
      loading,
      error,
      fetchAdminInfo,
    };
  },
};
</script>
<style scoped>
.d-flex {
  display: flex;
}

.content {
  flex-grow: 1;
  padding: 20px;
}

.loading {
  font-size: 18px;
  color: #ff9900;
}

.error {
  font-size: 18px;
  color: #ff0000;
}

.admin-info {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.admin-info h5 {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.admin-info p {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.admin-info p:nth-child(2) {
  font-weight: bold; /* Làm nổi bật MSNV */
}

.content {
  padding: 20px;
  margin-left: 250px;
  width: calc(100% - 250px);
}
</style>
