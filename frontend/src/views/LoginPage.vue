<template>
  <div>
    <!-- Header -->
    <Header />

    <!-- Login Form -->
    <div class="login-page">
      <LoginForm />
    </div>

    <Footer />
  </div>
</template>

<script>
// Import Header and LoginForm components
import Footer from "../components/Footer.vue";
import Header from "../components/Header.vue";
import LoginForm from "../components/LoginForm.vue";

export default {
  name: "LoginPage",
  components: {
    Header,
    LoginForm,
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
