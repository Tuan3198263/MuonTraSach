<template>
  <div>
    <!-- Header -->
    <Header />

    <!-- Register Form -->
    <RegisterForm />
  </div>

  <Footer />
</template>

<script>
// Import Header và RegisterForm từ các component tương ứng
import Header from "../components/Header.vue";
import RegisterForm from "../components/RegisterForm.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "RegisterPage",
  components: {
    Header,
    RegisterForm,
    Footer,
  },
};
</script>

<style scoped>
/* Bạn có thể thêm style cho trang này nếu cần */
</style>
