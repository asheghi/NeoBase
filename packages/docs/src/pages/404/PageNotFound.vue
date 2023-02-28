<template>
  <div class="PageNotFound">
    <NavBar />
    <div class="content">
      <IconConstruct
        class="mx-auto mt-16 fill-orange-400"
        width="120"
        height="120"
      />
      <div
        class="text-6xl mt-16 font-bold capitalize text-primary-800 dark:text-white font-extrabold"
      >
        <span class="text-orange-500">404 </span>
        page not found
      </div>
      <div class="text-primary-800 mt-8 text-lg font-bold dark:text-white">
        We're sorry but we couldn't find what you're looking for.
      </div>
    </div>
  </div>
</template>

<script setup>
import NavBar from "../index/views/NavBar.vue";
import IconConstruct from "ionicons/dist/svg/alert-circle-sharp.svg";
</script>
<script>
export default {
  name: "PageNotFound",
};
</script>

<style lang="scss">
.PageNotFound {
  .content {
    @apply py-16 px-4 text-center;
  }
}
</style>
