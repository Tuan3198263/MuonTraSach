<template>
  <main class="container my-4">
    <!-- Search Bar -->

    <div class="row mb-4">
      <div class="col-12">
        <div class="input-group">
          <input
            type="text"
            class="form-control search-input"
            v-model="searchQuery"
            placeholder="Tìm kiếm sách..."
          />
          <!-- Icon Search using Font Awesome -->
          <span class="input-group-text" id="search-addon">
            <i class="fas fa-search"></i>
            <!-- Font Awesome search icon -->
          </span>
        </div>
      </div>
    </div>

    <!-- Books List -->
    <section class="book-content">
      <h2 class="text-center mb-4">Danh Sách Sách</h2>
      <div class="row">
        <router-link
          v-for="(book, index) in paginatedBooks"
          :key="book.MaSach"
          :to="`/book/${book.MaSach}`"
          class="col-md-3 mb-4 text-decoration-none"
        >
          <div class="card h-100 book-card">
            <img
              :src="book.BiaSach"
              class="card-img-top book-image"
              :alt="book.TenSach"
            />
            <div class="card-body">
              <h5 class="card-title">{{ truncateTitle(book.TenSach) }}</h5>
              <p class="card-text">Tác giả: {{ book.TacGia }}</p>
              <!-- Bỏ hiển thị giá -->
              <p class="card-text">Số lượng: {{ book.SoLuong }}</p>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Pagination -->
      <div class="d-flex justify-content-center mt-4">
        <button
          v-if="currentPage > 1"
          @click="currentPage--"
          class="btn btn-pagination"
        >
          &lt;
        </button>
        <span class="pagination-info">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          v-if="currentPage < totalPages"
          @click="currentPage++"
          class="btn btn-pagination"
        >
          &gt;
        </button>
      </div>
    </section>
  </main>
</template>

<script>
import { ref, computed, onMounted } from "vue";

export default {
  setup() {
    const searchQuery = ref("");
    const currentPage = ref(1);
    const pageSize = 8; // 8 mục mỗi trang (4 trên 4 dưới)
    const books = ref([]);

    // Lấy dữ liệu sách từ API khi component được mount
    onMounted(async () => {
      try {
        const response = await fetch("http://localhost:3000/api/sach/list");
        const data = await response.json();

        if (data.message === "Lấy danh sách sách thành công!") {
          books.value = data.sachList;
        } else {
          console.error("Lỗi khi lấy dữ liệu sách");
        }
      } catch (error) {
        console.error("Lỗi kết nối API", error);
      }
    });

    // Lọc sách theo tìm kiếm
    const filteredBooks = computed(() => {
      return books.value.filter((book) =>
        book.TenSach.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    // Tính tổng số trang
    const totalPages = computed(() => {
      return Math.ceil(filteredBooks.value.length / pageSize);
    });

    // Lấy sách của trang hiện tại
    const paginatedBooks = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      const end = start + pageSize;
      return filteredBooks.value.slice(start, end);
    });

    // Hàm cắt ngắn tên sách nếu dài quá
    const truncateTitle = (title) => {
      return title.length > 20 ? title.slice(0, 20) + "..." : title;
    };

    return {
      searchQuery,
      currentPage,
      totalPages,
      paginatedBooks,
      filteredBooks,
      truncateTitle,
    };
  },
};
</script>

<style scoped>
.book-content {
  margin-top: 2rem;
}

.card {
  transition: transform 0.3s ease;
}

.card:hover {
  transform: scale(1.05);
}

.book-card {
  cursor: pointer;
}

.book-image {
  height: 250px;
  object-fit: cover;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.search-input {
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%; /* Đảm bảo thanh tìm kiếm chiếm toàn bộ chiều rộng */
}

.search-input {
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.input-group {
  width: 100%; /* Đảm bảo chiều rộng của nhóm input */
  max-width: 600px; /* Giới hạn chiều rộng tối đa của thanh tìm kiếm */
  margin: 0 auto; /* Căn giữa */
}

.input-group-text {
  background-color: #f8f9fa; /* Màu nền cho biểu tượng tìm kiếm */
  border-left: none; /* Bỏ viền bên trái của icon */
  border-radius: 0 5px 5px 0; /* Làm tròn góc bên phải của biểu tượng */
}

.fas.fa-search {
  font-size: 1.2rem; /* Điều chỉnh kích thước biểu tượng */
  color: #007bff;
}

.btn-pagination {
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-pagination:hover {
  background-color: #0056b3;
}

.pagination-info {
  margin: 0 1rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
}
</style>
