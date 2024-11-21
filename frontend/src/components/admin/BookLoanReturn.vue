<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <SidebarAdmin />

    <!-- Nội dung chính -->
    <div class="content flex-grow-1 p-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Quản lý Mượn/Trả Sách</h4>
        <button class="btn btn-success" @click="showAddLoanForm = true">
          Thêm
        </button>
      </div>

      <!-- Modal thêm Phiếu Mượn -->
      <div v-if="showAddLoanForm" class="add-loan-form mb-4">
        <h5>Thêm Phiếu Mượn Mới</h5>
        <form @submit.prevent="addLoan">
          <div class="mb-3">
            <label for="memberId" class="form-label">Mã Độc Giả</label>
            <input
              type="text"
              class="form-control"
              id="memberId"
              v-model="memberInput"
              required
              @blur="getMemberInfo(memberInput)"
            />
          </div>
          <!-- Hiển thị thông tin Họ và Tên độc giả -->
          <div class="mb-3">
            <label for="fullName" class="form-label">Họ và Tên</label>
            <input
              type="text"
              class="form-control"
              id="fullName"
              v-model="memberInfo.HoTen"
              disabled
            />
          </div>

          <div class="mb-3">
            <label for="bookId" class="form-label">Mã Sách</label>
            <input
              type="text"
              class="form-control"
              id="bookId"
              v-model="bookInput"
              required
              @blur="getBookInfo(bookInput)"
            />
          </div>

          <!-- Hiển thị thông tin sách -->
          <div class="mb-3">
            <label for="bookTitle" class="form-label">Nhan Đề</label>
            <input
              type="text"
              class="form-control"
              id="bookTitle"
              v-model="bookInfo.TenSach"
              disabled
            />
          </div>

          <!-- Thêm các trường khác nếu cần -->
          <div class="mb-3">
            <label for="author" class="form-label">Tác Giả</label>
            <input
              type="text"
              class="form-control"
              id="author"
              v-model="bookInfo.TacGia"
              disabled
            />
          </div>

          <div class="mb-3">
            <label for="loanDuration" class="form-label">Thời Gian Mượn</label>
            <select
              class="form-control"
              id="loanDuration"
              v-model="newLoan.ThoiHanMuon"
              required
            >
              <option value="3">3 ngày</option>
              <option value="5">5 ngày</option>
              <option value="7">7 ngày</option>
              <option value="14">14 ngày</option>
            </select>
          </div>

          <div class="d-flex justify-content-end mt-4">
            <button type="submit" class="btn btn-primary me-2">Lưu</button>
            <button
              type="button"
              class="btn btn-secondary"
              @click="showAddLoanForm = false"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>

      <!-- Modal Xem Chi Tiết -->
      <div v-if="isDetailLoanReturnModalVisible" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-info mb-4" style="font-weight: bold">
              Chi Tiết Mượn Trả
            </h5>
          </div>
          <div class="modal-body">
            <div v-if="selectedLoanReturn">
              <!-- Thêm MaDocGia vào đây -->
              <p>
                <strong>Mã độc giả:</strong>
                {{ selectedLoanReturn.MaDocGia.MaDocGia }}
              </p>
              <p>
                <strong>Người mượn:</strong>
                {{ selectedLoanReturn.MaDocGia.Ho }}
                {{ selectedLoanReturn.MaDocGia.Ten }}
              </p>

              <!-- Thêm MaSach vào đây -->
              <p>
                <strong>Mã sách:</strong>
                {{ selectedLoanReturn.MaSach.MaSach }}
              </p>

              <p>
                <strong>Tên sách:</strong>
                {{ selectedLoanReturn.MaSach.TenSach }}
              </p>

              <p>
                <strong>Ngày mượn:</strong>
                {{ formatDate(selectedLoanReturn.NgayMuon) }}
              </p>
              <p>
                <strong>Ngày trả:</strong>
                {{ formatDate(selectedLoanReturn.NgayTra) }}
              </p>
              <p>
                <strong>Trạng thái:</strong> {{ selectedLoanReturn.TrangThai }}
              </p>
              <p>
                <strong>Ghi chú:</strong>
                {{ selectedLoanReturn.GhiChu || "Không có ghi chú" }}
              </p>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              @click="closeDetailLoanReturnModal"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>

      <!-- Bảng Mượn/Trả Sách -->
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Mã Độc Giả</th>
            <th>Họ Tên</th>
            <th>Nhân Đề Sách</th>
            <th>Ngày Mượn</th>
            <th>Ngày Trả</th>
            <th>Trạng Thái</th>
            <th>Hành động</th>
          </tr>
          <tr>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchMemberId"
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
                v-model="searchBookTitle"
              />
            </th>
            <th>
              <input
                type="date"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchLoanDate"
              />
            </th>
            <th>
              <input
                type="date"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchReturnDate"
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
                v-model="searchStatus"
              />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="loanReturn in filteredLoanReturns" :key="loanReturn._id">
            <td>{{ loanReturn.MaDocGia.MaDocGia }}</td>
            <!-- Mã Độc Giả -->
            <td>{{ loanReturn.MaDocGia.Ho }} {{ loanReturn.MaDocGia.Ten }}</td>
            <!-- Họ Tên -->
            <td>{{ loanReturn.MaSach.TenSach }}</td>
            <!-- Nhân Đề Sách -->
            <td>{{ formatDate(loanReturn.NgayMuon) }}</td>
            <!-- Ngày Mượn -->
            <td>{{ formatDate(loanReturn.NgayTra) }}</td>
            <!-- Ngày Trả -->
            <td>{{ loanReturn.TrangThai }}</td>
            <!-- Trạng Thái -->
            <td>
              <!-- Icon Xem Chi Tiết -->
              <button
                class="btn"
                @click="openDetailLoanReturnModal(loanReturn)"
              >
                <i class="fas fa-eye"></i>
              </button>
              <!-- Icon Phê Duyệt -->
              <button
                class="btn"
                @click="returnBook(loanReturn.MaDocGia, loanReturn.MaSach)"
              >
                <i class="fas fa-check"></i>
              </button>

              <!-- Icon Xóa -->
              <button
                class="btn"
                @click="
                  deleteLoanReturn(loanReturn.MaDocGia, loanReturn.MaSach)
                "
              >
                <i class="fas fa-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

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
import { ref, onMounted, computed, reactive } from "vue";
import { useToast } from "vue-toastification";
import SidebarAdmin from "./SidebarAdmin.vue";

export default {
  components: {
    SidebarAdmin,
  },
  setup() {
    const toast = useToast();
    const showAddLoanForm = ref(false);
    const selectedLoanReturn = ref({}); // Dữ liệu chi tiết mượn trả

    const isDetailLoanReturnModalVisible = ref(false);
    const loanReturns = ref([]);
    const searchMemberId = ref("");
    const searchName = ref("");
    const searchBookTitle = ref("");
    const searchLoanDate = ref("");
    const searchReturnDate = ref("");
    const searchStatus = ref("");

    const currentPage = ref(1);
    const pageSize = 5;
    // Khởi tạo các đối tượng phản ứng (reactive)
    // Khai báo các biến cần thiết
    const newLoan = reactive({
      MaDocGia: "", // Sẽ lưu _id của độc giả
      MaSach: "", // Sẽ lưu _id của sách
      ThoiHanMuon: "",
      // Các trường khác cho phiếu mượn
    });

    const memberInfo = reactive({
      HoTen: "", // Lưu thông tin họ tên của độc giả
    });

    const bookInfo = reactive({
      TenSach: "", // Lưu thông tin tên sách
      TacGia: "",
    });

    const memberInput = ref(""); // Lưu mã độc giả nhập vào
    const bookInput = ref(""); // Lưu mã sách nhập vào
    // Hàm lấy danh sách mượn sách sử dụng fetch
    const fetchLoanReturns = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/muon-sach/list"
        );
        const data = await response.json();
        if (data && data.data) {
          loanReturns.value = data.data;
        }
        console.log(loanReturns.value);
      } catch (error) {
        toast.error("Lỗi khi lấy dữ liệu.");
      }
    };

    // Hàm định dạng ngày tháng
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };

    // Hàm lọc dữ liệu theo từ khóa tìm kiếm
    const filteredLoanReturns = computed(() => {
      return loanReturns.value.filter((loanReturn) => {
        const memberId = searchMemberId.value.toLowerCase();
        const name = searchName.value.toLowerCase();
        const bookTitle = searchBookTitle.value.toLowerCase();
        const loanDate = searchLoanDate.value;
        const returnDate = searchReturnDate.value;
        const status = searchStatus.value.toLowerCase();

        return (
          loanReturn.MaDocGia.MaDocGia.toLowerCase().includes(memberId) &&
          (loanReturn.MaDocGia.Ho + " " + loanReturn.MaDocGia.Ten)
            .toLowerCase()
            .includes(name) &&
          loanReturn.MaSach.TenSach.toLowerCase().includes(bookTitle) &&
          (loanDate ? loanReturn.NgayMuon.includes(loanDate) : true) &&
          (returnDate ? loanReturn.NgayTra.includes(returnDate) : true) &&
          loanReturn.TrangThai.toLowerCase().includes(status)
        );
      });
    });

    // Gọi hàm khi component được mount
    onMounted(() => {
      fetchLoanReturns();
    });

    const openDetailLoanReturnModal = (loanReturn) => {
      selectedLoanReturn.value = { ...loanReturn };
      console.log(isDetailLoanReturnModalVisible.value); // Kiểm tra trạng thái modal
      isDetailLoanReturnModalVisible.value = true;
    };

    const closeDetailLoanReturnModal = () => {
      isDetailLoanReturnModalVisible.value = false;
      selectedLoanReturn.value = null;
    };

    // Phương thức trả sách
    const returnBook = async (MaDocGia, MaSach) => {
      // Xác nhận trả sách
      const isConfirmed = window.confirm(
        "Cập nhật trạng thái phiếu mượn này thành trả?"
      );
      if (!isConfirmed) return;

      try {
        // Gửi yêu cầu trả sách
        const response = await fetch(
          "http://localhost:3000/api/muon-sach/tra",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              MaDocGia: MaDocGia, // ID của độc giả
              MaSach: MaSach, // ID của sách
            }),
          }
        );

        const result = await response.json(); // Chuyển đổi phản hồi thành JSON

        if (response.ok) {
          toast.success("Trả sách thành công!");
          fetchLoanReturns(); // Cập nhật lại danh sách mượn sách sau khi trả sách thành công
        } else {
          toast.error("Lỗi: " + result.message);
        }
      } catch (error) {
        console.error("Lỗi khi trả sách:", error);
        toast.error("Đã xảy ra lỗi khi trả sách");
      }
    };

    const deleteLoanReturn = async (MaDocGia, MaSach) => {
      // Hỏi lại người dùng trước khi xóa
      const isConfirmed = window.confirm(
        "Bạn có chắc chắn muốn xóa thông tin mượn sách này?"
      );

      if (!isConfirmed) {
        return; // Nếu người dùng không xác nhận, dừng lại và không xóa
      }

      try {
        // Gửi yêu cầu DELETE đến API
        const response = await fetch(
          "http://localhost:3000/api/muon-sach/xoa",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              MaDocGia: MaDocGia, // ID của độc giả
              MaSach: MaSach, // ID của sách
            }),
          }
        );

        const result = await response.json(); // Chuyển đổi phản hồi thành JSON

        if (response.ok) {
          toast.success("Xóa thông tin mượn sách thành công!");
          // Cập nhật lại danh sách mượn sách sau khi xóa
          fetchLoanReturns();
        } else {
          toast.error("Lỗi: " + result.message); // Thông báo lỗi nếu có
        }
      } catch (error) {
        console.error("Lỗi khi xóa mượn sách:", error);
        toast.error("Đã xảy ra lỗi khi xóa mượn sách");
      }
    };

    const addLoan = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/muon-sach/muon",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              MaDocGia: newLoan.MaDocGia,
              MaSach: newLoan.MaSach,
              ThoiHanMuon: newLoan.ThoiHanMuon,
            }),
          }
        );

        const result = await response.json();

        if (response.ok) {
          toast.success("Thêm phiếu mượn thành công!");
          // Reset form sau khi thêm thành công
          newLoan.value = {
            MaDocGia: "",
            MaSach: "",
            ThoiHanMuon: "",
          };

          // Reset các trường trong form sau khi thêm thành công
          newLoan.MaDocGia = "";
          newLoan.MaSach = "";
          newLoan.ThoiHanMuon = "";
          showAddLoanForm.value = false; // Đóng modal
          fetchLoanReturns();
        } else {
          toast.error("Lỗi: " + result.message);
        }
      } catch (error) {
        console.error("Lỗi khi thêm phiếu mượn:", error);
        toast.error("Đã xảy ra lỗi khi thêm phiếu mượn");
      }
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
    const totalPages = computed(() => {
      return Math.ceil(loanReturns.value.length / pageSize);
    });

    // Phương thức lấy thông tin sách từ MaSach
    const getBookInfo = async (bookId) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/sach/thongtin/${bookId}`
        );
        const data = await response.json();
        if (data && data.sach) {
          bookInfo.TenSach = data.sach.TenSach; // Lưu tên sách vào bookInfo
          bookInfo.TacGia = data.sach.TacGia;
          newLoan.MaSach = data.sach._id; // Gán _id của sách vào newLoan.MaSach
          console.log(newLoan.MaSach);
        } else {
          toast.error("Không tìm thấy sách!");
        }
      } catch (error) {
        toast.error("Lỗi khi lấy thông tin sách!");
        console.error(error);
      }
    };

    // Phương thức lấy thông tin độc giả từ MaDocGia
    const getMemberInfo = async (memberId) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/docgia/thongtin/${memberId}`
        );
        const data = await response.json();
        if (data && data.docGia) {
          memberInfo.HoTen = `${data.docGia.Ho} ${data.docGia.Ten}`; // Gộp Họ và Tên
          newLoan.MaDocGia = data.docGia._id; // Gán _id của độc giả vào newLoan.MaDocGia
          console.log(newLoan.MaDocGia);
        } else {
          toast.error("Không tìm thấy thông tin độc giả!");
        }
      } catch (error) {
        toast.error("Lỗi khi lấy thông tin độc giả!");
        console.error(error);
      }
    };

    return {
      showAddLoanForm,
      loanReturns,
      selectedLoanReturn,
      searchMemberId,
      searchName,
      searchBookTitle,
      searchLoanDate,
      searchReturnDate,
      searchStatus,
      filteredLoanReturns,
      formatDate,
      openDetailLoanReturnModal,
      closeDetailLoanReturnModal,
      returnBook,
      deleteLoanReturn,
      prevPage,
      nextPage,
      changePage,
      currentPage, // Đảm bảo trả về currentPage để sử dụng trong template
      pageSize,
      isDetailLoanReturnModalVisible,
      totalPages,
      newLoan,
      addLoan,
      getBookInfo,
      getMemberInfo,
      bookInfo,
      memberInfo,
      memberInput,
      bookInput,
    };
  },
};
</script>

<style scoped>
/* Thêm các kiểu CSS tùy chỉnh tại đây */
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
.add-loan-form {
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
  font-size: 12px; /* Tăng kích thước icon */
  padding: 5px;
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
