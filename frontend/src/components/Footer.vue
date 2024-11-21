<template>
  <footer class="footer text-center py-4 mt-5">
    <div class="container">
      <p class="mb-2">© 2024 My Bookstore</p>
      <p>
        Liên hệ:
        <a href="mailto:contact@bookstore.com">contact@bookstore.com</a>
      </p>
      <p>
        <a href="/privacy-policy">Chính sách bảo mật</a> |
        <a href="/terms-of-service">Điều khoản sử dụng</a>
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
.footer {
  background-color: #f8f9fa;
  color: #333;
  border-top: 1px solid #e7e7e7;
}

.footer a {
  color: #007bff;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.footer p {
  margin: 0;
}
</style>
