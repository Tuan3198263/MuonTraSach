<template>
  <div class="not-found">
    <h1>404 - Trang không tồn tại</h1>
    <p>Xin lỗi, trang bạn đang tìm kiếm không tồn tại.</p>
    <router-link to="/">Quay về trang chủ</router-link>
  </div>
</template>

<script>
export default {
  name: "NotFound",
};
</script>

<style scoped>
.not-found {
  text-align: center;
  margin-top: 50px;
}
h1 {
  font-size: 3em;
  color: #d9534f;
}
p {
  font-size: 1.5em;
  margin-bottom: 20px;
}
</style>
