<template>
  <div class="d-flex">
    <!-- Sidebar -->
    <SidebarAdmin />

    <!-- Nội dung chính -->
    <div class="content flex-grow-1 p-3">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Biên mục</h4>
        <div class="d-flex align-items-center">
          <input
            type="text"
            class="form-control me-2"
            placeholder="Search..."
          />

          <button class="btn btn-success me-2">Thêm</button>
        </div>
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
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
              />
            </th>
            <th>
              <input
                type="text"
                class="form-control"
                placeholder="Tìm kiếm..."
              />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Âm nhạc cổ truyền dân tộc người Việt</td>
            <td>BÙI NGỌC PHÁC</td>
            <td>0</td>
            <td>Mỹ thuật</td>
            <td>5</td>
            <td>
              <button class="btn"><i class="fas fa-edit"></i></button>
              <button class="btn"><i class="fas fa-trash"></i></button>
            </td>
          </tr>
          <!-- Các dòng khác -->
        </tbody>
      </table>
      <div class="d-flex justify-content-between align-items-center">
        <span>Tổng số 3.960 biên mục</span>
        <nav>
          <ul class="pagination">
            <li class="page-item">
              <a class="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&lt;</span>
              </a>
            </li>
            <li class="page-item">
              <a class="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&gt;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainContent",
  components: {},
};
</script>

<style scoped>
.content {
  padding: 20px;
  margin-left: 250px; /* Đảm bảo nội dung không bị che khuất bởi sidebar */
  width: calc(100% - 250px); /* Giới hạn độ rộng của nội dung */
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
.table .btn i {
  margin-right: 8px;
}
.table .btn i:hover {
  color: #e74c3c;
}
</style>
