<template>
  <div class="cover-router-view">
    <router-view v-slot="{ Component }">
      <transition class="" name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
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
.cover-router-view{
  @apply relative;
  & > * {
    @apply absolute inset-0;
  }
}
</style>
