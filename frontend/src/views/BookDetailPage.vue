<template>
  <!-- Header Section -->
  <Header />

  <!-- Body Section -->
  <BookDetail />
</template>

<script>
// Import Header and Body components
import Header from "../components/Header.vue";
import BookDetail from "../components/BookDetail.vue";

export default {
  name: "Book",
  components: {
    Header,
    BookDetail,
  },
};
</script>

<style scoped>
/* Các kiểu dáng tùy chỉnh nếu cần */
</style>
