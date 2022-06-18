<template>
  <div class="HomePage">
    <NavBar />
    <div class="cover">
      <div class="logo">
      </div>
      <h1 class="header-text">NeoBase</h1>
      <p class="desc">
        flexible, scalable database for mobile, web, and server development
      </p>
      <router-link to="/register" class="btn"> Get Started </router-link>
      <router-link to="/login" class="text-gray-400"
        >already have an account</router-link
      >
    </div>
  </div>
</template>
<script setup>
import IconServer from "ionicons/dist/svg/server.svg";
import NavBar from "./views/NavBar.vue";
</script>
<script>
export default {
  name: "HomePage",
};
</script>
<style lang="scss">
.HomePage {
  .cover {
    @apply min-h-screen  container mx-auto px-4 flex flex-col gap-6 justify-center items-center;
  }
  .header-text {
    @apply text-6xl font-extrabold text-transparent
    bg-clip-text bg-gradient-to-r from-yellow-300 to-red-400;
  }

  .desc {
    @apply text-lg text-center;
    max-width: 400px;
  }
  .btn {
    @apply bg-gradient-to-t from-red-600 to-yellow-600 px-4 py-2 rounded font-bold;
  }
}
</style>
