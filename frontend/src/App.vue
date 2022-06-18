<template>
  <div class="cover-router-view">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: "MainLayout",
};
</script>

<style lang="scss">
html {
  transition: background-color ease 250ms;
}
.dark {
  @apply bg-gray-700 text-white fill-white;
}
</style>
