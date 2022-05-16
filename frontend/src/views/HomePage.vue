<template>
  <div class="HomePage ">
    <div class="cover">
      <img :src="logoImage" width="120" height="120"/>
      <h1 class="header-text">Wild Fire</h1>
      <p class="desc">
        flexible, scalable database for mobile, web, and server development
      </p>
      <router-link to="/register" class="btn">
        Get Started
      </router-link>
    </div>
  </div>
</template>
<script>
import logoImage from '../assets/logo.png?url'

export default {
  name: "HomePage",
  data() {
    return {
      logoImage,
    }
  }
}
</script>
<style lang="scss">
.HomePage {
  @apply bg-gray-800;
  .cover{
   @apply min-h-screen  container mx-auto px-4 flex flex-col gap-6 justify-center items-center;
  }
  .header-text {
    @apply text-6xl font-extrabold text-transparent
    bg-clip-text bg-gradient-to-r from-yellow-300 to-red-400;
  }

  .desc{
    @apply text-white text-lg text-center;
    max-width: 400px;
  }
  .btn{
    @apply text-white bg-gradient-to-t from-red-600 to-yellow-600 px-4 py-2 rounded font-bold;
  }
}
</style>
