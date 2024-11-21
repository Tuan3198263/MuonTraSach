<template>
  <main class="container my-5">
    <!-- Hiển thị thông báo đang tải thông tin sách -->
    <div v-if="loading">
      <p>Đang tải thông tin sách...</p>
    </div>

    <!-- Hiển thị thông tin sách sau khi đã tải xong -->
    <div v-else-if="book">
      <div class="row">
        <!-- Cột chứa thông tin sách -->
        <div class="col-md-6">
          <div class="row">
            <div class="col-md-4">
              <img
                v-if="book.BiaSach"
                :src="book.BiaSach"
                class="img-fluid book-image-detail"
                alt="Sách"
              />
              <div v-else>
                <p>Không có ảnh bìa</p>
              </div>
            </div>

            <div class="col-md-8">
              <h2>{{ book.TenSach }}</h2>
              <p><strong>Mã sách:</strong> {{ book.MaSach }}</p>
              <p><strong>Tác giả:</strong> {{ book.TacGia }}</p>
              <p><strong>Nhà xuất bản:</strong> {{ book.MaNXB.TenNXB }}</p>
              <p>
                <strong>Đơn giá:</strong> {{ formatPrice(book.DonGia) }} VND
              </p>
              <p><strong>Số lượng còn lại:</strong> {{ book.SoLuong }}</p>

              <!-- Nút mượn sách -->
              <button
                :disabled="isBorrowed || book.SoLuong <= 0"
                class="btn btn-primary"
                @click="openBorrowForm"
              >
                <!-- Hiển thị theo trạng thái sách -->
                <span v-if="isBorrowed">Sách đã mượn</span>
                <span v-else-if="book.SoLuong <= 0">Sách đã hết</span>
                <span v-else>Mượn sách</span>
              </button>

              <!-- Hiển thị thông báo khi sách đã mượn -->
              <p v-if="isBorrowed" class="mt-3 text-danger">
                Sách này đã được mượn.
              </p>
              <!-- Hiển thị thông báo khi hết sách -->
              <p v-else-if="book.SoLuong <= 0" class="mt-3 text-danger">
                Sách đã hết số lượng.
              </p>
            </div>
          </div>
        </div>

        <!-- Cột chứa ảnh quảng cáo -->
        <div class="col-md-6">
          <img
            src="../assets/img/tltc.jpg"
            class="img-fluid ad-image"
            alt="Quảng cáo"
          />
        </div>
      </div>
    </div>

    <!-- Form mượn sách -->
    <div v-if="showBorrowForm" class="borrow-form">
      <div class="modal-overlay">
        <div class="modal-content">
          <h3>Chọn thời gian mượn sách</h3>
          <form @submit.prevent="borrowBook">
            <div class="form-group">
              <label for="borrowDuration">Thời hạn mượn</label>
              <select
                id="borrowDuration"
                v-model="borrowDuration"
                class="form-control"
              >
                <option value="3">3 ngày</option>
                <option value="5">5 ngày</option>
                <option value="7">7 ngày</option>
                <option value="14">14 ngày</option>
              </select>
            </div>
            <div class="form-group mt-3">
              <button type="submit" class="btn btn-primary">
                Xác nhận mượn sách
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                @click="closeBorrowForm"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification"; // Import hook
import { useAuthStore } from "../stores/useAuthStore"; // Import store

export default {
  setup() {
    const book = ref(null);
    const isBorrowed = ref(false); // Trạng thái đã mượn sách
    const showBorrowForm = ref(false); // Trạng thái hiển thị form
    const borrowDuration = ref(3); // Thời gian mượn mặc định
    const route = useRoute();
    const bookId = route.params.MaSach;
    const loading = ref(true); // Trạng thái đang tải dữ liệu
    const toast = useToast(); // Khởi tạo hook toast
    // Lấy thông tin đăng nhập từ store
    const authStore = useAuthStore();
    const isLoggedIn = authStore.isLoggedIn;

    // Lấy thông tin sách từ API theo MaSach
    const fetchBookDetail = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/sach/thongtin/${bookId}`
        );
        const data = await response.json();
        if (data.message === "Lấy thông tin sách thành công!") {
          book.value = data.sach;
        } else {
          console.error("Lỗi khi lấy thông tin sách");
        }
      } catch (error) {
        console.error("Lỗi kết nối API", error);
      } finally {
        loading.value = false; // Sau khi tải xong hoặc có lỗi, thay đổi trạng thái tải
      }
    };

    const checkBorrowedStatus = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/muon-sach/docGia/kiem-tra-sach-da-muon`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ MaSach: book.value._id }),
          }
        );
        const data = await response.json();
        if (data.daMuon) {
          isBorrowed.value = true;
        }
      } catch (error) {
        console.error("Lỗi kiểm tra trạng thái mượn sách", error);
      }
    };

    onMounted(async () => {
      await fetchBookDetail();
      if (isLoggedIn) {
        await checkBorrowedStatus();
      }
    });

    const openBorrowForm = () => {
      if (isLoggedIn) {
        showBorrowForm.value = true; // Hiển thị form khi click nút mượn sách
      } else {
        toast.error("Vui lòng đăng nhập để mượn sách");
      }
    };

    const closeBorrowForm = () => {
      showBorrowForm.value = false; // Đóng form
    };

    const borrowBook = async () => {
      if (book.value.SoLuong > 0) {
        // Gửi yêu cầu mượn sách đến API
        try {
          const response = await fetch(
            "http://localhost:3000/api/muon-sach/docGia/muon",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Token để xác thực người dùng
              },
              body: JSON.stringify({
                MaSach: book.value._id, // MaSach lấy từ thông tin sách
                ThoiHanMuon: borrowDuration.value, // Thời gian mượn từ người dùng
              }),
            }
          );

          const data = await response.json();

          console.log(data); // Kiểm tra phản hồi từ API

          if (response.ok) {
            toast.success(
              `Đã mượn sách ${book.value.TenSach} trong ${borrowDuration.value} ngày!`
            );
            checkBorrowedStatus();

            closeBorrowForm(); // Đóng form mượn sách
          } else {
            toast.error("Không thể mượn sách. Vui lòng thử lại!");
          }
        } catch (error) {
          console.error("Lỗi khi mượn sách", error);
          toast.error("Đã có lỗi khi mượn sách. Vui lòng thử lại.");
        }
      }
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat("vi-VN").format(price);
    };

    return {
      book,
      borrowBook,
      formatPrice,
      isBorrowed,
      showBorrowForm,
      borrowDuration,
      openBorrowForm,
      closeBorrowForm,
      loading,
      isLoggedIn,
    };
  },
};
</script>

<style scoped>
.book-image-detail {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.ad-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

button:disabled {
  background-color: #d6d6d6;
  color: #888;
  cursor: not-allowed;
}

button {
  font-size: 1.2rem;
  padding: 12px 24px;
  border-radius: 8px;
  background-color: #007bff;
  color: white;
  border: none;
  margin-top: 15px;
  transition: background-color 0.3s, transform 0.2s ease;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
  transform: scale(1.05);
}

h2 {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

p {
  font-size: 1.1rem;
  color: #555;
  margin: 10px 0;
}

button:disabled:hover {
  background-color: #d6d6d6;
  transform: none;
}

/* Form mượn sách */
.borrow-form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-overlay {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 10px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 20px;
}

.modal-content .form-group {
  margin-bottom: 20px;
}

.modal-content select,
.modal-content button {
  width: 100%;
  padding: 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 15px;
  background-color: #f8f9fa;
  color: #333;
}

.modal-content select:focus,
.modal-content button:focus {
  border-color: #007bff;
  outline: none;
  background-color: #e9ecef;
}

.modal-content button {
  background-color: #28a745;
  color: white;
  border: none;
}

.modal-content button:hover {
  background-color: #218838;
}

.modal-content .btn-secondary {
  background-color: #6c757d;
}

.modal-content .btn-secondary:hover {
  background-color: #5a6268;
}
</style>
