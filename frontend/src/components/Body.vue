<template>
  <main class="container my-4">
    <!-- Carousel Section -->
    <div
      id="bookCarousel"
      class="carousel slide carousel-wrapper mb-4"
      data-bs-ride="carousel"
    >
      <div class="carousel-indicators">
        <button
          type="button"
          data-bs-target="#bookCarousel"
          data-bs-slide-to="0"
          class="active"
          aria-current="true"
        ></button>
        <button
          type="button"
          data-bs-target="#bookCarousel"
          data-bs-slide-to="1"
        ></button>
        <button
          type="button"
          data-bs-target="#bookCarousel"
          data-bs-slide-to="2"
        ></button>
        <button
          type="button"
          data-bs-target="#bookCarousel"
          data-bs-slide-to="3"
        ></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active">
          <div class="overlay">
            <img
              src="../assets/img/naruto1.webp"
              class="d-block w-100 carousel-image"
              alt="Image 1"
            />
          </div>
        </div>
        <div class="carousel-item">
          <div class="overlay">
            <img
              src="../assets/img/hero-carousel-comic.jpg"
              class="d-block w-100 carousel-image"
              alt="Image 2"
            />
          </div>
        </div>
        <div class="carousel-item">
          <div class="overlay">
            <img
              src="../assets/img/conan1.jpg"
              class="d-block w-100 carousel-image"
              alt="Image 3"
            />
          </div>
        </div>
        <div class="carousel-item">
          <div class="overlay">
            <img
              src="../assets/img/comic.jpg"
              class="d-block w-100 carousel-image"
              alt="Image 4"
            />
          </div>
        </div>
      </div>
      <button
        class="carousel-control-prev"
        type="button"
        data-bs-target="#bookCarousel"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next"
        type="button"
        data-bs-target="#bookCarousel"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>

    <!-- Books Section -->
    <section class="book-content my-4">
      <div class="row">
        <div
          class="col-md-3"
          v-for="(book, index) in books.slice(0, 4)"
          :key="index"
        >
          <div class="card h-100">
            <img
              :src="book.BiaSach"
              class="card-img-top book-image"
              :alt="book.TenSach"
            />
            <div class="card-body">
              <h5 class="card-title">{{ book.TenSach }}</h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const books = ref([]);
    const loading = ref(true);

    // Fetch books from the API
    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/sach/list");
        const data = await response.json();

        if (data.sachList) {
          books.value = data.sachList;
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        loading.value = false;
      }
    };

    // Call fetchBooks when the component is mounted
    onMounted(() => {
      fetchBooks();
    });

    return { books, loading };
  },
};
</script>

<style scoped>
.carousel-wrapper {
  background-color: rgba(0, 0, 0, 0.6); /* Màu nền cho khung carousel */
  padding: 20px;
  border-radius: 10px; /* Bo tròn góc */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Đổ bóng để tạo chiều sâu */
}

.carousel-image {
  height: 500px;
  object-fit: cover;
  border-radius: 10px; /* Bo tròn góc ảnh để đồng bộ với khung */
}

.overlay::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.3)
  ); /* Tạo overlay gradient */
  z-index: 1;
}

.carousel-indicators button {
  background-color: rgba(
    255,
    255,
    255,
    0.7
  ); /* Màu trong suốt cho nút chỉ số */
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: rgba(
    255,
    255,
    255,
    0.5
  ); /* Tăng độ trong suốt cho nút điều khiển */
}
.card-img-top {
  height: 300px; /* Thiết lập chiều cao cố định cho ảnh */
  object-fit: cover; /* Đảm bảo ảnh bao phủ khu vực mà không bị biến dạng */
  width: 100%; /* Đảm bảo ảnh chiếm toàn bộ chiều rộng của thẻ */
  border-radius: 10px; /* Bo tròn góc ảnh nếu cần */
}
</style>
