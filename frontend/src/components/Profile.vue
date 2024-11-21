<template>
  <main class="container my-4">
    <!-- Thông tin người dùng -->
    <section class="user-info mb-5">
      <h2 class="text-center mb-4">Thông tin người dùng</h2>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">
            Mã độc giả: {{ user.MaDocGia }} (Dùng để mượn sách)
          </h5>
          <h5 class="card-title">Họ và tên: {{ user.name }}</h5>
          <p class="card-text">Ngày sinh: {{ formattedDate(user.NgaySing) }}</p>
          <p class="card-text">Giới tính: {{ user.GioiTinh }}</p>
          <p class="card-text">Địa chỉ: {{ user.DiaChi }}</p>
          <p class="card-text">Số điện thoại: {{ user.Sdt }}</p>
          <!-- Dòng cảnh báo thêm -->
          <p class="text-muted small mt-3">
            Quên mật khẩu hoặc muốn sửa thông tin? Xin vui lòng liên hệ:
            <a href="mailto:tuanb2113346@student.ctu.edu.vn">
              tuanb2113346@student.ctu.edu.vn
            </a>
          </p>
        </div>
      </div>
    </section>

    <!-- Thông tin mượn sách -->
    <section class="borrowed-books">
      <h2 class="text-center mb-4">Thông tin mượn sách</h2>
      <div
        v-if="borrowedBooks.length === 0"
        class="alert alert-info text-center"
      >
        Bạn chưa mượn sách nào.
      </div>
      <div v-else class="row">
        <!-- Hiển thị thông tin từng sách mượn dưới dạng card -->
        <div
          v-for="book in borrowedBooks"
          :key="book.MaSach.MaSach"
          class="col-md-4 mb-4"
        >
          <router-link :to="`/book/${book.MaSach.MaSach}`" class="card-link">
            <div class="card">
              <!-- Hiển thị ảnh bìa sách -->
              <img
                v-if="book.MaSach.BiaSach"
                :src="book.MaSach.BiaSach"
                alt="Bìa sách"
                class="card-img-top book-cover"
              />
              <div class="card-body">
                <h5 class="card-title">{{ book.MaSach.TenSach }}</h5>
                <p class="card-text">Tác giả: {{ book.MaSach.TacGia }}</p>
                <p class="card-text">
                  Ngày mượn: {{ formattedDate(book.NgayMuon) }}
                </p>
                <p class="card-text">
                  Ngày trả dự kiến: {{ formattedDate(book.NgayTra) }}
                </p>
                <p class="card-text">Trạng thái: {{ book.TrangThai }}</p>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const user = ref({
      MaDocGia: "",
      name: "",
      NgaySing: "",
      GioiTinh: "",
      DiaChi: "",
      Sdt: "",
    });

    const borrowedBooks = ref([]);

    // Lấy thông tin người dùng và sách mượn từ API
    onMounted(async () => {
      try {
        // Lấy thông tin người dùng từ API
        const response = await fetch(
          "http://localhost:3000/api/docGia/thongtin",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Lấy token từ localStorage
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.message === "Thông tin độc giả") {
            const userInfo = data.userInfo;
            user.value.MaDocGia = userInfo.MaDocGia;
            user.value.name = `${userInfo.Ho} ${userInfo.Ten}`;
            user.value.NgaySing = userInfo.NgaySing;
            user.value.GioiTinh = userInfo.GioiTinh;
            user.value.DiaChi = userInfo.DiaChi;
            user.value.Sdt = userInfo.Sdt;
          }
        } else {
          console.error("Không thể lấy thông tin người dùng");
        }

        // Lấy thông tin sách mượn
        const booksResponse = await fetch(
          "http://localhost:3000/api/muon-sach/docGia/sach-da-muon",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (booksResponse.ok) {
          const booksData = await booksResponse.json();
          borrowedBooks.value = booksData.data || [];
        }
      } catch (error) {
        console.error(
          "Lỗi khi lấy thông tin người dùng hoặc sách mượn:",
          error
        );
      }
    });

    // Hàm định dạng ngày sinh và ngày mượn
    const formattedDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    };

    return {
      user,
      borrowedBooks,
      formattedDate,
    };
  },
};
</script>

<style scoped>
.user-info {
  margin-bottom: 2rem;
}

.card {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-body {
  font-size: 1.1rem;
}

.borrowed-books {
  margin-top: 3rem;
}

.card {
  font-size: 1.1rem;
}

.card-img-top {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.book-cover {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card-body {
  padding: 1rem;
}

.card-title {
  font-weight: bold;
}

.alert-info {
  font-size: 1.2rem;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-link {
  text-decoration: none;
}

.card-link:hover {
  text-decoration: none;
  color: inherit;
}
.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Đảm bảo các cột có đủ không gian */
}

.col-md-4 {
  flex: 0 0 32%; /* Điều chỉnh mỗi cột chiếm 32% chiều rộng, giúp 3 cột trên mỗi dòng */
}
.text-muted {
  font-size: 0.9rem;
}

a {
  text-decoration: none;
  color: #007bff;
}

a:hover {
  color: #0056b3;
}
</style>
