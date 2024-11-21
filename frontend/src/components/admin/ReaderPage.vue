<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <SidebarAdmin />

    <!-- Nội dung chính -->
    <div class="content flex-grow-1 p-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Người Đọc</h4>
        <button class="btn btn-success" @click="showAddReaderForm = true">
          Thêm
        </button>
      </div>

      <!-- Modal thêm Người Đọc -->
      <div v-if="showAddReaderForm" class="add-reader-form mb-4">
        <h5>Thêm Người Đọc Mới</h5>
        <form @submit.prevent="addReader">
          <div class="mb-3">
            <label for="readerHo" class="form-label">Họ</label>
            <input
              type="text"
              class="form-control"
              id="readerHo"
              v-model="newReader.Ho"
              required
            />
          </div>
          <div class="mb-3">
            <label for="readerName" class="form-label">Tên</label>
            <input
              type="text"
              class="form-control"
              id="readerName"
              v-model="newReader.Ten"
              required
            />
          </div>
          <div class="mb-3">
            <label for="readerDob" class="form-label">Ngày Sinh</label>
            <input
              type="date"
              class="form-control"
              id="readerDob"
              v-model="newReader.NgaySinh"
              required
            />
          </div>
          <div class="mb-3">
            <label for="readerGender" class="form-label">Giới Tính</label>
            <select
              id="readerGender"
              class="form-select"
              v-model="newReader.GioiTinh"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="readerAddress" class="form-label">Địa Chỉ</label>
            <input
              type="text"
              class="form-control"
              id="readerAddress"
              v-model="newReader.DiaChi"
              required
            />
          </div>
          <div class="mb-3">
            <label for="readerPhone" class="form-label">Số Điện Thoại</label>
            <input
              type="text"
              class="form-control"
              id="readerPhone"
              v-model="newReader.Sdt"
              required
              pattern="^0\d{7,10}$"
            />
          </div>
          <div class="mb-3">
            <label for="readerPassword" class="form-label">Mật Khẩu</label>
            <input
              type="password"
              class="form-control"
              id="readerPassword"
              v-model="newReader.Password"
              required
            />
          </div>
          <div class="d-flex justify-content-end mt-4">
            <button type="submit" class="btn btn-primary me-2">Lưu</button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="showAddReaderForm = false"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>

      <!-- Bảng Người Đọc -->
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Mã Người Đọc</th>
            <th>Họ và Tên</th>
            <th>Ngày Sinh</th>
            <th>Giới Tính</th>
            <th>Địa Chỉ</th>
            <th>Hành động</th>
          </tr>
          <tr>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchMaDocGia"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchName"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchDob"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchGender"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchAddress"
              />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reader in paginatedReaders" :key="reader.MaDocGia">
            <td>{{ reader.MaDocGia }}</td>
            <!-- Mã độc giả -->
            <td>{{ reader.Ho }} {{ reader.Ten }}</td>
            <!-- Họ và tên -->
            <td>{{ formatDate(reader.NgaySinh) }}</td>
            <!-- Ngày sinh (cần chuyển đổi định dạng ngày) -->
            <td>{{ reader.GioiTinh }}</td>
            <!-- Giới tính -->
            <td>{{ reader.DiaChi || "Chưa cập nhật" }}</td>
            <!-- Địa chỉ (nếu có) -->
            <td>
              <button class="btn" @click="openEditReaderModal(reader)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn" @click="deleteReader(reader.MaDocGia)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Chỉnh sửa Người Đọc -->
      <div v-if="isEditReaderModalVisible" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger" style="font-weight: bold">
              Chỉnh sửa Người Đọc
            </h5>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateReader">
              <!-- Trường Mã Độc Giả -->
              <div class="mb-3">
                <label for="readerId" class="form-label">Mã Người Đọc</label>
                <input
                  type="text"
                  class="form-control"
                  id="readerId"
                  :value="selectedReader.MaDocGia"
                  readonly
                />
              </div>
              <div class="mb-3">
                <label for="readerName" class="form-label">Tên Người Đọc</label>
                <input
                  v-model="selectedReader.Ten"
                  type="text"
                  class="form-control"
                  id="readerName"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="readerSurname" class="form-label"
                  >Họ Người Đọc</label
                >
                <input
                  v-model="selectedReader.Ho"
                  type="text"
                  class="form-control"
                  id="readerSurname"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="gender" class="form-label">Giới Tính</label>
                <select
                  v-model="selectedReader.GioiTinh"
                  class="form-control"
                  id="gender"
                  required
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div class="mb-3">
                <label for="address" class="form-label">Địa Chỉ</label>
                <input
                  v-model="selectedReader.DiaChi"
                  type="text"
                  class="form-control"
                  id="address"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="phone" class="form-label">Số Điện Thoại</label>
                <input
                  v-model="selectedReader.Sdt"
                  type="text"
                  class="form-control"
                  id="phone"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Mật Khẩu</label>
                <input
                  v-model="selectedReader.Password"
                  type="text"
                  class="form-control"
                  id="password"
                  required
                />
              </div>

              <div class="modal-footer">
                <button
                  type="submit"
                  class="btn btn-primary"
                  style="margin-right: 5px"
                >
                  Cập nhật
                </button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeEditReaderModal"
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
  components: {
    SidebarAdmin,
  },
  setup() {
    const toast = useToast(); // Khai báo toast từ useToast
    const showAddReaderForm = ref(false);
    const isEditReaderModalVisible = ref(false);

    const searchMaDocGia = ref("");
    const searchName = ref("");
    const searchDob = ref("");
    const searchGender = ref("");
    const searchAddress = ref("");
    const newReader = ref({
      Ho: "", // Đảm bảo tên trường khớp với API
      Ten: "",
      Sdt: "",
      Password: "",
      NgaySinh: "",
      GioiTinh: "",
      DiaChi: "",
    });

    const selectedReader = ref({});
    const currentPage = ref(1);
    const perPage = ref(5);

    const readers = ref([
      /* Danh sách người đọc (giả lập dữ liệu) */
    ]);

    // Hàm lấy danh sách người đọc từ API
    const fetchReaders = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/docGia/getAllDocGia"
        );
        const data = await response.json();
        readers.value = data.docGias; // Lưu danh sách độc giả vào state
        console.log(readers.value);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người đọc:", error);
      }
    };

    // Hàm thêm người đọc mới

    const filteredReaders = computed(() => {
      return readers.value.filter((reader) => {
        // Kết hợp họ và tên thành fullName
        const fullName = `${reader.Ho.toLowerCase()} ${reader.Ten.toLowerCase()}`;

        return (
          reader.MaDocGia.toLowerCase().includes(
            searchMaDocGia.value.toLowerCase()
          ) && // Tìm kiếm theo mã độc giả
          fullName.includes(searchName.value.toLowerCase()) && // Tìm kiếm theo họ và tên
          reader.NgaySinh.includes(searchDob.value) && // Tìm kiếm theo ngày sinh
          reader.GioiTinh.toLowerCase().includes(
            searchGender.value.toLowerCase()
          ) && // Tìm kiếm theo giới tính
          (reader.DiaChi || "")
            .toLowerCase()
            .includes(searchAddress.value.toLowerCase()) // Tìm kiếm theo địa chỉ
        );
      });
    });

    const paginatedReaders = computed(() => {
      const start = (currentPage.value - 1) * perPage.value;
      return filteredReaders.value.slice(start, start + perPage.value);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredReaders.value.length / perPage.value);
    });

    const openEditReaderModal = (reader) => {
      selectedReader.value = { ...reader };
      isEditReaderModalVisible.value = true;
    };

    const addReader = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/docGia/themDocGia",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newReader.value),
          }
        );

        if (response.ok) {
          // Đọc dữ liệu từ phản hồi
          const data = await response.json();

          // Thêm người đọc mới vào danh sách hiện tại
          readers.value.push(data.docGia); // Giả sử readers là danh sách người đọc hiện tại

          // Đóng form và reset dữ liệu
          showAddReaderForm.value = false;
          newReader.value = {
            Ten: "",
            Ho: "",
            NgaySinh: "",
            GioiTinh: "",
            DiaChi: "",
            Sdt: "",
            Password: "",
          };

          // Thông báo thành công
          toast.success("Người đọc đã được thêm thành công!");
        } else {
          // Xử lý khi phản hồi không OK (lỗi)
          const errorData = await response.json();
          // Kiểm tra nếu có thông tin lỗi từ server
          const errorMessage =
            errorData.message || "Lỗi không xác định từ server!";
          toast.error(`Lỗi: ${errorMessage}`);
        }
      } catch (error) {
        // Thông báo lỗi khi có lỗi xảy ra trong quá trình gọi API
        console.error("Có lỗi xảy ra khi thêm người đọc:", error);
        toast.error("Đã có lỗi xảy ra khi thêm người đọc");
      }
    };

    const updateReader = async () => {
      try {
        console.log(selectedReader.value); // In toàn bộ selectedReader để kiểm tra xem dữ liệu có đầy đủ không

        const response = await fetch(
          `http://localhost:3000/api/docGia/edit/${selectedReader.value.MaDocGia}`, // Sử dụng MaDocGia trong URL
          {
            method: "PUT", // Chọn phương thức PUT vì đang cập nhật dữ liệu
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Ho: selectedReader.value.Ho,
              Ten: selectedReader.value.Ten,
              Sdt: selectedReader.value.Sdt,
              Password: selectedReader.value.Password,
              NgaySinh: selectedReader.value.NgaySinh,
              GioiTinh: selectedReader.value.GioiTinh,
              DiaChi: selectedReader.value.DiaChi,
            }), // Gửi toàn bộ dữ liệu của người đọc cần cập nhật
          }
        );
        const data = await response.json();
        if (response.ok) {
          toast.success("Cập nhật người đọc thành công!");
          // Cập nhật lại danh sách người đọc sau khi sửa
          fetchReaders();
          closeEditReaderModal();
        } else {
          toast.error(data.message || "Lỗi khi cập nhật thông tin người đọc!");
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật người đọc:", error);
        toast.error("Có lỗi xảy ra khi cập nhật!");
      }
    };

    const deleteReader = async (MaDocGia) => {
      const confirmed = confirm("Bạn có chắc chắn muốn xóa độc giả này?");
      if (!confirmed) {
        return; // Exit if the user cancels
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/docGia/delete/${MaDocGia}`,
          {
            method: "DELETE",
          }
        );

        // Kiểm tra nếu response ok
        if (response.ok) {
          readers.value = readers.value.filter(
            (reader) => reader.MaDocGia !== MaDocGia
          );
          toast.success("Độc giả đã được xóa!");
        } else {
          // Bắt lỗi khi response không ok
          const errorData = await response.json(); // Lấy dữ liệu lỗi từ server
          const errorMessage =
            errorData.message || "Có lỗi xảy ra khi xóa độc giả!";
          toast.error(errorMessage); // Hiển thị thông báo lỗi từ server
        }
      } catch (error) {
        toast.error("Lỗi kết nối khi xóa độc giả!");
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const changePage = (page) => {
      currentPage.value = page;
    };

    const closeEditReaderModal = () => {
      isEditReaderModalVisible.value = false;
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString(); // Chuyển đổi ngày sang định dạng địa phương
    };

    onMounted(() => {
      fetchReaders();
    });

    return {
      showAddReaderForm,
      isEditReaderModalVisible,
      searchMaDocGia,
      searchName,
      searchGender,
      searchDob,
      searchAddress,
      newReader,
      selectedReader,
      currentPage,
      perPage,
      readers,
      filteredReaders,
      paginatedReaders,
      totalPages,

      openEditReaderModal,
      addReader,
      updateReader,
      deleteReader,
      prevPage,
      nextPage,
      changePage,
      closeEditReaderModal,
      formatDate,
    };
  },
};
</script>

<style scoped>
/* Styles for ReaderPage */
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
.add-reader-form {
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
.modal-body {
  max-height: 500px; /* Chiều cao tối đa của phần nội dung modal */
  overflow-y: auto; /* Cho phép cuộn dọc khi nội dung dài */
}
</style>
