<template>
  <div>
    <!-- Header -->
    <Header />

    <!-- Register Form -->
    <AdminRegisterForm />
  </div>

  <Footer />
</template>

<script>
// Import Header và RegisterForm từ các component tương ứng
import AdminRegisterForm from "../../components/admin/AdminRegisterForm.vue";
import Header from "../../components/Header.vue";
import Footer from "../../components/Footer.vue";

export default {
  name: "RegisterPage",
  components: {
    Header,
    AdminRegisterForm,
    Footer,
  },
};
</script>

<style scoped>
/* Bạn có thể thêm style cho trang này nếu cần */
</style>
