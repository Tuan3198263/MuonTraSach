<template>
  <div>
    <!-- Header Section -->
    <Header />

    <!-- Body Section -->
    <Body />

    <Footer />
  </div>
</template>

<script>
// Import Header and Body components
import Header from "../components/Header.vue";
import Body from "../components/Body.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "Home",
  components: {
    Header,
    Body,
    Footer,
  },
};
</script>

<style scoped>
/* Các kiểu dáng tùy chỉnh nếu cần */
</style>
