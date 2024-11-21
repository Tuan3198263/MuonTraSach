<template>
  <div>
    <!-- Header -->
    <Header />

    <!-- Login Form -->
    <div class="login-page">
      <AdminLoginForm />
    </div>

    <Footer />
  </div>
</template>

<script>
// Import Header and LoginForm components
import Header from "../../components/Header.vue";
import AdminLoginForm from "../../components/admin/AdminLoginForm.vue";
import Footer from "../../components/Footer.vue";

export default {
  name: "LoginPage",
  components: {
    Header,
    AdminLoginForm,
    Footer,
  },
};
</script>

<style scoped>
.login-page {
  padding: 20px;
  background-color: #e9ecef;
}
</style>
