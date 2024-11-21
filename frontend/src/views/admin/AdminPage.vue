<template>
  <div class="admin-page">
    <!-- Sidebar -->
    <SidebarAdmin />

    <!-- Nội dung chính -->
    <div class="content">
      <!-- Sử dụng router-view để hiển thị các trang con -->
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import SidebarAdmin from "../../components/admin/SideBarAdmin.vue";

export default {
  name: "AdminPage",
  components: {
    SidebarAdmin,
  },
};
</script>

<style scoped>
/* Bố trí trang AdminPage */
.admin-page {
  display: flex;
}
</style>
