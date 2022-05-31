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

<style></style>
