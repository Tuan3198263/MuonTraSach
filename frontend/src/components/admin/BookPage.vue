<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <SidebarAdmin />

    <!-- Nội dung chính -->
    <div class="content flex-grow-1 p-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Sách</h4>
        <div class="d-flex align-items-center">
          <button class="btn btn-success me-2" @click="showAddBookForm = true">
            Thêm
          </button>
        </div>
      </div>

      <!-- Form Thêm Sách -->
      <div v-if="showAddBookForm" class="add-book-form mb-4">
        <h5>Thêm sách mới</h5>
        <form @submit.prevent="addBook">
          <div class="mb-3">
            <label for="title" class="form-label">
              <i class="fas fa-book"></i> Nhan đề
            </label>
            <input
              type="text"
              class="form-control"
              id="title"
              v-model="newBook.TenSach"
              required
            />
          </div>
          <div class="mb-3">
            <label for="author" class="form-label">
              <i class="fas fa-user"></i> Tác giả
            </label>
            <input
              type="text"
              class="form-control"
              id="author"
              v-model="newBook.TacGia"
              required
            />
          </div>
          <div class="mb-3">
            <label for="price" class="form-label">
              <i class="fas fa-tag"></i> Giá bìa
            </label>
            <input
              type="number"
              class="form-control"
              id="price"
              v-model="newBook.DonGia"
              required
            />
          </div>
          <div class="mb-3">
            <label for="publisher" class="form-label">
              <i class="fas fa-building"></i> Nhà xuất bản
            </label>
            <select
              id="publisher"
              class="form-control"
              v-model="newBook.MaNXB"
              required
            >
              <option value="" disabled selected>Chọn nhà xuất bản</option>
              <option
                v-for="publisher in publishers"
                :key="publisher._id"
                :value="publisher._id"
              >
                {{ publisher.TenNXB }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="quantity" class="form-label">
              <i class="fas fa-cogs"></i> Số quyển
            </label>
            <input
              type="number"
              class="form-control"
              id="quantity"
              v-model="newBook.SoLuong"
              required
            />
          </div>
          <!-- Trường Bìa Sách -->
          <div class="mb-3">
            <label for="cover" class="form-label">
              <i class="fas fa-image"></i> Bìa sách
            </label>
            <input
              type="file"
              class="form-control"
              id="cover"
              @change="handleFileChange"
            />
          </div>

          <div class="d-flex justify-content-end mt-4">
            <button type="submit" class="btn btn-primary btn-md me-2">
              Lưu
            </button>
            <button
              type="button"
              class="btn btn-secondary btn-md"
              @click="showAddBookForm = false"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>

      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Nhan đề</th>
            <th scope="col">Tác giả</th>
            <th scope="col">Giá bìa</th>
            <th scope="col">Nhà xuất bản</th>
            <th scope="col">Số quyển</th>
            <th scope="col">Hành động</th>
          </tr>
          <tr>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchTitle"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchAuthor"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchPrice"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchPublisher"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchQuantity"
              />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in paginatedBooks" :key="book.MaSach">
            <td>{{ book.TenSach }}</td>
            <td>{{ book.TacGia }}</td>
            <td>{{ book.DonGia }}</td>
            <td>{{ book.MaNXB.TenNXB }}</td>
            <td>{{ book.SoLuong }}</td>
            <td>
              <button class="btn" @click="openEditBookModal(book)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn" @click="deleteBook(book.MaSach)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Edit Book (ẩn hiện) -->
      <div v-if="isEditBookModalVisible" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger" style="font-weight: bold">
              Chỉnh sửa sách
            </h5>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateBook">
              <div class="mb-3">
                <label for="bookTitle" class="form-label">Nhan đề</label>
                <input
                  v-model="selectedBook.TenSach"
                  type="text"
                  class="form-control"
                  id="bookTitle"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="bookAuthor" class="form-label">Tác giả</label>
                <input
                  v-model="selectedBook.TacGia"
                  type="text"
                  class="form-control"
                  id="bookAuthor"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="bookPrice" class="form-label">Giá bìa</label>
                <input
                  v-model="selectedBook.DonGia"
                  type="text"
                  class="form-control"
                  id="bookPrice"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="publisher" class="form-label">
                  <i class="fas fa-building"></i> Nhà xuất bản
                </label>
                <select
                  id="publisher"
                  class="form-control"
                  v-model="selectedBook.MaNXB"
                  required
                >
                  <option value="" disabled selected>Chọn nhà xuất bản</option>
                  <option
                    v-for="publisher in publishers"
                    :key="publisher._id"
                    :value="publisher._id"
                  >
                    {{ publisher.TenNXB }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label for="bookQuantity" class="form-label">Số quyển</label>
                <input
                  v-model="selectedBook.SoLuong"
                  type="number"
                  class="form-control"
                  id="bookQuantity"
                  required
                />
              </div>

              <div class="modal-footer">
                <button
                  type="submit"
                  class="btn btn-primary"
                  style="margin-right: 10px"
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeEditBookModal"
                >
                  Đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Điều hướng phân trang -->
      <nav>
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="prevPage">Trước</button>
          </li>
          <li
            class="page-item"
            v-for="page in totalPages"
            :key="page"
            :class="{ active: currentPage === page }"
          >
            <button class="page-link" @click="changePage(page)">
              {{ page }}
            </button>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage === totalPages }"
          >
            <button class="page-link" @click="nextPage">Tiếp theo</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useToast } from "vue-toastification"; // Import useToast
import SidebarAdmin from "./SidebarAdmin.vue";

export default {
  name: "MainContent",
  components: {
    SidebarAdmin,
  },
  setup() {
    const toast = useToast(); // Khai báo toast từ useToast
    const books = ref([]);
    const publishers = ref([]); // Danh sách nhà xuất bản
    const searchTitle = ref("");
    const searchAuthor = ref("");
    const searchPrice = ref("");
    const searchPublisher = ref("");
    const searchQuantity = ref("");
    const currentPage = ref(1);
    const pageSize = ref(10); // Số lượng sách trên mỗi trang

    const showAddBookForm = ref(false); // Để điều khiển hiển thị form thêm sách
    const newBook = ref({
      MaSach: `S${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      TenSach: "",
      TacGia: "",
      DonGia: "",
      MaNXB: "", // Gán MaNXB là ID của nhà xuất bản thay vì đối tượng
      SoLuong: 0,
      BiaSach: null,
    });

    // Định nghĩa trạng thái modal và thông tin sách hiện tại
    const isEditBookModalVisible = ref(false); // Trạng thái hiển thị modal
    const selectedBook = ref({}); // Dữ liệu sách được chọn

    // Hàm mở modal và điền thông tin sách vào modal
    const openEditBookModal = (book) => {
      selectedBook.value = { ...book }; // Sao chép thông tin sách vào selectedBook
      selectedBook.value.MaNXB = book.MaNXB._id; // Gán ID nhà xuất bản vào selectedBook.MaNXB
      isEditBookModalVisible.value = true; // Mở modal
    };

    // Hàm đóng modal
    const closeEditBookModal = () => {
      isEditBookModalVisible.value = false; // Ẩn modal
    };

    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/sach/list");
        if (response.ok) {
          const data = await response.json();
          books.value = data.sachList;
        } else {
          console.error("Có lỗi khi lấy dữ liệu sách:", response.status);
        }
      } catch (error) {
        console.error("Lỗi khi kết nối với API:", error);
      }
    };

    const fetchPublishers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/nhaXuatBan/list"
        );
        if (response.ok) {
          const data = await response.json();
          console.log(data); // In toàn bộ dữ liệu trả về từ API

          // Truy cập trường "data" thay vì "nhaXuatBanList"
          if (data && data.data) {
            publishers.value = data.data; // Gán danh sách nhà xuất bản từ trường "data"
            console.log("Danh sách nhà xuất bản:", publishers.value);
          } else {
            console.error("Không tìm thấy trường data trong dữ liệu API");
          }
        } else {
          console.error(
            "Có lỗi khi lấy dữ liệu nhà xuất bản:",
            response.status
          );
        }
      } catch (error) {
        console.error("Lỗi khi kết nối với API:", error);
      }
    };

    const addBook = async () => {
      // Kiểm tra nếu các trường thông tin cơ bản chưa đầy đủ

      // Tạo đối tượng FormData để gửi yêu cầu với ảnh bìa nếu có
      const formData = new FormData();
      formData.append("MaSach", newBook.value.MaSach);
      formData.append("TenSach", newBook.value.TenSach);
      formData.append("TacGia", newBook.value.TacGia);
      formData.append("DonGia", newBook.value.DonGia);
      formData.append("MaNXB", newBook.value.MaNXB);
      formData.append("SoLuong", newBook.value.SoLuong);

      // Nếu có ảnh bìa, thêm ảnh vào FormData
      if (newBook.value.BiaSach) {
        formData.append("BiaSach", newBook.value.BiaSach);
      }
      console.log(newBook.value);

      try {
        // Gửi yêu cầu POST đến API để thêm sách mới
        const response = await fetch("http://localhost:3000/api/sach/add", {
          method: "POST",
          body: formData,
        });

        // Xử lý kết quả trả về từ server
        if (response.ok) {
          const data = await response.json();
          toast.success("Sách đã được thêm thành công!"); // Thay alert bằng toast.success

          // Đóng form thêm sách sau khi thành công
          showAddBookForm.value = false;

          // Cập nhật lại danh sách sách
          fetchBooks();

          // Đặt lại thông tin sách mới sau khi thêm thành công
          newBook.value = {
            MaSach: `S${Math.floor(Math.random() * 1000)
              .toString()
              .padStart(3, "0")}`,
            TenSach: "",
            TacGia: "",
            DonGia: "",
            MaNXB: "",
            SoLuong: 0,
            BiaSach: null,
          };

          // Nếu bạn muốn xóa sạch các trường tìm kiếm
          searchTitle.value = "";
          searchAuthor.value = "";
          searchPrice.value = "";
          searchPublisher.value = "";
          searchQuantity.value = "";
        } else {
          const errorData = await response.json();
          toast.error(`Lỗi: ${errorData.message}`); // Thay alert bằng toast.error
        }
      } catch (error) {
        console.error("Lỗi khi gửi yêu cầu:", error);
        toast.error("Đã có lỗi xảy ra khi thêm sách"); // Thay alert bằng toast.error
      }
    };

    const updateBook = async () => {
      try {
        // Lấy MaSach từ selectedBook
        const MaSach = selectedBook.value.MaSach; // Hoặc _id tùy vào dữ liệu của bạn

        const response = await fetch(
          `http://localhost:3000/api/sach/edit/${MaSach}`,
          {
            method: "PUT", // Hoặc PATCH nếu bạn chỉ cập nhật một phần thông tin
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              TenSach: selectedBook.value.TenSach,
              TacGia: selectedBook.value.TacGia,
              DonGia: selectedBook.value.DonGia,
              MaNXB: selectedBook.value.MaNXB, // Chỉ gửi mã nhà xuất bản (ID)
              SoLuong: selectedBook.value.SoLuong,
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          // Cập nhật thành công
          toast.success("Cập nhật sách thành công!"); // Thay thế alert bằng toast.success
          closeEditBookModal(); // Đóng modal
          fetchBooks();
          // Cập nhật lại danh sách sách nếu cần
        } else {
          // Xử lý khi có lỗi
          toast.error(`Lỗi: ${result.message}`); // Thay thế alert bằng toast.error
        }
      } catch (error) {
        console.error("Có lỗi xảy ra khi cập nhật sách:", error);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại."); // Thay thế alert bằng toast.error
      }
    };

    const deleteBook = async (MaSach) => {
      // Hiển thị hộp thoại xác nhận
      const isConfirmed = window.confirm("Bạn có chắc chắn muốn xóa sách này?");

      if (!isConfirmed) {
        // Nếu người dùng không xác nhận, dừng việc xóa
        return;
      }

      try {
        // Gửi yêu cầu DELETE đến API
        const response = await fetch(
          `http://localhost:3000/api/sach/delete/${MaSach}`,
          {
            method: "DELETE", // Sử dụng phương thức DELETE
          }
        );

        // Kiểm tra kết quả trả về từ API
        if (response.ok) {
          const data = await response.json();
          toast.success("Sách đã được xóa thành công!"); // Thay thế alert bằng toast.success
          console.log(data.message);

          // Cập nhật lại danh sách sách sau khi xóa
          fetchBooks();
        } else {
          // Nếu response không ok, lấy thông tin lỗi từ server
          const errorData = await response.json();

          // Kiểm tra lỗi từ server và hiển thị thông báo chi tiết
          if (errorData.message) {
            toast.error(`Lỗi: ${errorData.message}`); // Thay thế alert bằng toast.error
          } else {
            toast.error("Đã có lỗi không xác định xảy ra.");
          }
        }
      } catch (error) {
        // Bắt lỗi kết nối hoặc lỗi không xác định
        console.error("Lỗi khi gửi yêu cầu xóa sách:", error);
        toast.error("Đã có lỗi xảy ra khi xóa sách."); // Thay thế alert bằng toast.error
      }
    };

    // Phương thức xử lý khi người dùng chọn ảnh bìa
    const handleFileChange = (event) => {
      const file = event.target.files[0]; // Lấy file đầu tiên (nếu có)
      if (file) {
        // Kiểm tra loại file (chỉ cho phép ảnh)
        const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
        if (validImageTypes.includes(file.type)) {
          // Sử dụng FileReader để đọc và hiển thị ảnh
          const reader = new FileReader();
          reader.onload = () => {
            // Lưu ảnh vào newBook
            newBook.value.BiaSach = file; // Lưu file ảnh vào đối tượng
          };
          reader.readAsDataURL(file); // Đọc file ảnh dưới dạng base64 (nếu cần)
        } else {
          alert("Vui lòng chọn một file ảnh hợp lệ (JPG, PNG, GIF).");
        }
      }
    };

    const filteredBooks = computed(() => {
      return books.value.filter((book) => {
        return (
          book.TenSach.toLowerCase().includes(
            searchTitle.value.toLowerCase()
          ) &&
          book.TacGia.toLowerCase().includes(
            searchAuthor.value.toLowerCase()
          ) &&
          book.DonGia.toString().includes(searchPrice.value) &&
          book.MaNXB.TenNXB.toLowerCase().includes(
            searchPublisher.value.toLowerCase()
          ) &&
          book.SoLuong.toString().includes(searchQuantity.value)
        );
      });
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredBooks.value.length / pageSize.value) || 1;
    });

    const paginatedBooks = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      return filteredBooks.value.slice(start, end);
    });

    function changePage(page) {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    }

    function prevPage() {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    }

    function nextPage() {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    }

    onMounted(() => {
      fetchBooks();
      fetchPublishers();
    });

    return {
      isEditBookModalVisible,
      selectedBook,
      openEditBookModal,
      closeEditBookModal,
      updateBook,
      books,
      publishers,

      searchTitle,
      searchAuthor,
      searchPrice,
      searchPublisher,
      searchQuantity,
      filteredBooks,
      showAddBookForm,
      newBook,
      addBook,
      deleteBook,
      handleFileChange, // Trả về phương thức để sử dụng trong template
      currentPage,
      pageSize,
      paginatedBooks,
      totalPages,
      changePage,
      prevPage,
      nextPage,
    };
  },
};
</script>

<style scoped>
.content {
  padding: 20px;
  margin-left: 250px;
  width: calc(100% - 250px);
}

.table th,
.table td {
  vertical-align: middle;
}

.table th {
  background-color: #f8f9fa;
}

.table .btn {
  padding: 0;
  border: none;
  background: none;
}

.table .btn i {
  color: #16a085;
}

.table .btn i:hover {
  color: #138d75;
}

.pagination {
  justify-content: flex-end;
}
.add-book-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.add-book-form h5 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
}
/* Điều chỉnh kích thước icon và khoảng cách giữa chúng */
.btn i {
  font-size: 20px; /* Tăng kích thước icon */
  padding: 7px;
  transition: transform 0.3s ease, color 0.3s ease; /* Hiệu ứng khi hover */
}

/* Thêm hiệu ứng hover cho icon */
.btn i:hover {
  transform: scale(1.1); /* Phóng to icon khi hover */
  color: #138d75; /* Thay đổi màu sắc khi hover */
}

/* Điều chỉnh hiệu ứng hover cho button */
.btn:hover {
  background-color: #d1d5d8; /* Màu nền khi hover */
}

/* Nút "Lưu" (btn-primary) */
.btn-primary i {
  color: #fff; /* Màu icon trong nút "Lưu" */
}

.btn-primary:hover i {
  color: #fff; /* Màu icon khi hover trên nút "Lưu" */
}

/* Nút "Hủy" (btn-secondary) */
.btn-secondary i {
  color: #fff; /* Màu icon trong nút "Hủy" */
}

.btn-secondary:hover i {
  color: #fff; /* Màu icon khi hover trên nút "Hủy" */
}

/* Đảm bảo khoảng cách giữa các nút */
.d-flex {
  display: flex;
  justify-content: space-between;
}

.mt-4 {
  margin-top: 1.5rem; /* Khoảng cách trên */
}

/* Modal overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Màu nền mờ */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 500px; /* Kích thước modal */
}
</style>
