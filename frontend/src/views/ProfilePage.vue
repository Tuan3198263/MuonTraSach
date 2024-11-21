<template>
  <!-- Header Section -->
  <Header />

  <!-- Body Section -->
  <Profile />

  <!-- Footer Section -->
  <Footer />
</template>

<script>
// Import Header and Profile components
import Header from "../components/Header.vue";
import Profile from "../components/Profile.vue";
import Footer from "../components/Footer.vue";

export default {
  name: "ProfilePage",
  components: {
    Header,
    Profile,
    Footer,
  },
};
</script>
