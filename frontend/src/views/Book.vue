<template>
  <div>
    <!-- Header Section -->
    <Header />

    <!-- Body Section -->
    <BookList />

    <Footer />
  </div>
</template>

<script>
// Import Header and Body components
import Header from "../components/Header.vue";
import BookList from "../components/BookList.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "Book",
  components: {
    Header,
    BookList,
    Footer,
  },
};
</script>

<style scoped>
/* Các kiểu dáng tùy chỉnh nếu cần */
</style>
