<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <SidebarAdmin />

    <!-- Nội dung chính -->
    <div class="content flex-grow-1 p-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Nhà Xuất Bản</h4>
        <button class="btn btn-success" @click="showAddPublisherForm = true">
          Thêm
        </button>
      </div>

      <!--Modal thêm NXB-->
      <div v-if="showAddPublisherForm" class="add-publisher-form mb-4">
        <h5>Thêm Nhà Xuất Bản Mới</h5>
        <form @submit.prevent="addPublisher">
          <div class="mb-3">
            <label for="publisherId" class="form-label">Mã NXB</label>
            <input
              type="text"
              class="form-control"
              id="publisherId"
              v-model="newPublisher.MaNXB"
              required
            />
          </div>
          <div class="mb-3">
            <label for="publisherName" class="form-label">Tên NXB</label>
            <input
              type="text"
              class="form-control"
              id="publisherName"
              v-model="newPublisher.TenNXB"
              required
            />
          </div>
          <div class="mb-3">
            <label for="address" class="form-label">Địa chỉ</label>
            <input
              type="text"
              class="form-control"
              id="address"
              v-model="newPublisher.DiaChi"
              required
            />
          </div>

          <!-- Căn nút về phía phải -->
          <div class="d-flex justify-content-end mt-4">
            <button type="submit" class="btn btn-primary me-2">Lưu</button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="showAddPublisherForm = false"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>

      <!-- Bảng Nhà Xuất Bản -->
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Mã NXB</th>
            <th>Tên NXB</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
          <tr>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchId"
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
                v-model="searchAddress"
              />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="publisher in paginatedPublishers" :key="publisher.MaNXB">
            <td>{{ publisher.MaNXB }}</td>
            <td>{{ publisher.TenNXB }}</td>
            <td>{{ publisher.DiaChi }}</td>
            <td>
              <button class="btn" @click="openEditPublisherModal(publisher)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn" @click="deletePublisher(publisher.MaNXB)">
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Modal Chỉnh sửa Nhà Xuất Bản -->
      <div v-if="isEditPublisherModalVisible" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger" style="font-weight: bold">
              Chỉnh sửa Nhà Xuất Bản
            </h5>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updatePublisher">
              <div class="mb-3">
                <label for="publisherName" class="form-label">Tên NXB</label>
                <input
                  v-model="selectedPublisher.TenNXB"
                  type="text"
                  class="form-control"
                  id="publisherName"
                  required
                />
              </div>

              <div class="mb-3">
                <label for="address" class="form-label">Địa chỉ</label>
                <input
                  v-model="selectedPublisher.DiaChi"
                  type="text"
                  class="form-control"
                  id="address"
                  required
                />
              </div>

              <div class="modal-footer">
                <button type="submit" class="btn btn-primary">Cập nhật</button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="closeEditPublisherModal"
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
import { ref, computed, onMounted, toRaw } from "vue";
import { useToast } from "vue-toastification"; // Import useToast
import SidebarAdmin from "./SidebarAdmin.vue";

export default {
  components: {
    SidebarAdmin, // Đăng ký component tại đây
  },
  setup() {
    const toast = useToast(); // Khai báo toast từ useToast
    const showAddPublisherForm = ref(false);
    const isEditPublisherModalVisible = ref(false);

    const searchId = ref("");
    const searchName = ref("");
    const searchAddress = ref("");
    const newPublisher = ref({ MaNXB: "", TenNXB: "", DiaChi: "" });
    const selectedPublisher = ref({});
    const currentPage = ref(1);
    const perPage = ref(5);

    const publishers = ref([
      /* Danh sách các nhà xuất bản (giả lập dữ liệu) */
    ]);

    // Hàm lấy danh sách nhà xuất bản
    const fetchPublishers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/nhaXuatBan/list"
        );
        const data = await response.json(); // Chuyển đổi phản hồi thành JSON
        publishers.value = data.data; // Lưu dữ liệu vào biến reactive
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu:", error);
      }
    };

    // Hàm để thêm nhà xuất bản mới
    const addPublisher = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/nhaXuatBan/add",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newPublisher.value),
          }
        );

        const result = await response.json(); // Phản hồi từ server
        if (response.ok) {
          toast.success("Thêm nhà xuất bản thành công!");
          // Reset form sau khi thêm thành công
          newPublisher.value = { MaNXB: "", TenNXB: "", DiaChi: "" };
          fetchPublishers();
        } else {
          toast.error("Lỗi: " + result.message); // Thông báo lỗi nếu có
        }
      } catch (error) {
        console.error("Lỗi khi thêm nhà xuất bản:", error);
        toast.error("Đã xảy ra lỗi khi thêm nhà xuất bản"); // Thông báo lỗi nếu có
      }
    };

    const filteredPublishers = computed(() => {
      return publishers.value.filter((publisher) => {
        return (
          publisher.MaNXB.includes(searchId.value) &&
          publisher.TenNXB.toLowerCase().includes(
            searchName.value.toLowerCase()
          ) &&
          publisher.DiaChi.toLowerCase().includes(
            searchAddress.value.toLowerCase()
          )
        );
      });
    });

    const paginatedPublishers = computed(() => {
      const start = (currentPage.value - 1) * perPage.value;
      return filteredPublishers.value.slice(start, start + perPage.value);
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredPublishers.value.length / perPage.value);
    });

    const openEditPublisherModal = (publisher) => {
      selectedPublisher.value = { ...publisher };
      isEditPublisherModalVisible.value = true;
    };

    const updatePublisher = async () => {
      try {
        const publisherToUpdate = toRaw(selectedPublisher.value); // Loại bỏ reactivity
        const publisherData = {
          ...publisherToUpdate,
          MaNXB: selectedPublisher.value.MaNXB, // Đảm bảo MaNXB được truyền vào body
        };

        const response = await fetch(
          `http://localhost:3000/api/nhaXuatBan/edit`, // API edit
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(publisherData), // Truyền data vào body
          }
        );

        const result = await response.json();

        if (response.ok) {
          //alert("Cập nhật nhà xuất bản thành công");
          toast.success("Cập nhật nhà xuất bản thành công!");
          fetchPublishers(); // Lấy lại danh sách nhà xuất bản
          closeEditPublisherModal(); // Đóng modal sau khi cập nhật
        } else {
          toast.error("Lỗi: " + result.message); // Thông báo lỗi nếu có
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật nhà xuất bản:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật nhà xuất bản");
      }
    };

    const deletePublisher = async (MaNXB) => {
      // Hỏi lại người dùng trước khi xóa
      const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn xóa nhà xuất bản này?"
      );

      if (!isConfirmed) {
        return; // Nếu người dùng không xác nhận, dừng lại và không xóa
      }

      try {
        const response = await fetch(
          `http://localhost:3000/api/nhaXuatBan/delete/${MaNXB}`, // Truyền MaNXB vào URL
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const result = await response.json();

        if (response.ok) {
          toast.success("Xóa nhà xuất bản thành công"); // Thông báo thành công
          fetchPublishers(); // Lấy lại danh sách nhà xuất bản sau khi xóa
        } else {
          toast.error("Lỗi: " + result.message); // Thông báo lỗi nếu có
        }
      } catch (error) {
        console.error("Lỗi khi xóa nhà xuất bản:", error);
        toast.error("Đã xảy ra lỗi khi xóa nhà xuất bản"); // Thông báo lỗi khi gặp sự cố
      }
    };

    const closeEditPublisherModal = () => {
      isEditPublisherModalVisible.value = false;
      selectedPublisher.value = {};
    };

    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) currentPage.value++;
    };

    const changePage = (page) => {
      currentPage.value = page;
    };

    // Gọi hàm fetchPublishers khi component được mounted
    onMounted(() => {
      fetchPublishers();
    });

    return {
      showAddPublisherForm,
      isEditPublisherModalVisible,
      searchId,
      searchName,
      searchAddress,
      newPublisher,
      selectedPublisher,
      currentPage,
      perPage,
      publishers,
      filteredPublishers,
      paginatedPublishers,
      totalPages,
      addPublisher,
      openEditPublisherModal,
      updatePublisher,
      deletePublisher,
      closeEditPublisherModal,
      prevPage,
      nextPage,
      changePage,
      addPublisher,
      updatePublisher,
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
