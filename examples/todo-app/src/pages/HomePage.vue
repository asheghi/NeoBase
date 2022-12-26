<template>
  <div class="HomePage">
    <div class="cover">
      <img :src="logoImage" width="120" height="120" />
      <h1 class="header-text">Todo App</h1>
      <p class="desc">simple todo app built with NeoBase</p>
      <router-link to="/register" class="btn"> Register </router-link>
      <router-link
        to="/login"
        class="text-gray-400 underline underline-offset-2"
        >already have an account</router-link
      >
    </div>
  </div>
</template>
<script>
import logoImage from "../assets/logo.png?url";

export default {
  name: "HomePage",
  data() {
    return {
      logoImage,
    };
  },
};
</script>
<style lang="scss">
.HomePage {
  @apply bg-gray-800;
  .cover {
    @apply min-h-screen  container mx-auto px-4 flex flex-col gap-6 justify-center items-center;
  }
  .header-text {
    @apply text-6xl font-extrabold text-transparent
    bg-clip-text bg-gradient-to-t from-green-400 to-green-900;
  }

  .desc {
    @apply text-white text-lg text-center;
    max-width: 400px;
  }
  .btn {
    @apply text-white bg-gradient-to-t from-green-600 to-green-800 px-4 py-2 rounded font-bold;
  }
}
</style>
