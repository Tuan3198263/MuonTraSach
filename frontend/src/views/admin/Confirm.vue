<template>
  <div>
    <!-- Header -->
    <Header />

    <!-- Login Form -->
    <div class="">
      <PasswordPage />
    </div>
  </div>
</template>

<script>
// Import Header and LoginForm components
import Header from "../../components/Header.vue";
import PasswordPage from "../../components/admin/PasswordPage.vue";

export default {
  name: "Confirm",
  components: {
    Header,
    PasswordPage,
  },
};
</script>

<style scoped>
.login-page {
  padding: 20px;
  background-color: #e9ecef;
}
</style>
