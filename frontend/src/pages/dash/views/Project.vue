<template>
  <div class="Project">
    <div class="tabs">
      <router-link :to="{ name: 'collections' }">Data</router-link>
      <router-link :to="{ name: 'auth' }">Authentication</router-link>
      <router-link :to="{ name: 'access' }">Access Control</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "Project",
  components: {},
  data() {
    return {
      currentTab: "Data",
      tabItems: ["Data", "Auth", "Access Control", "Usage"],
    };
  },
};
</script>

<style lang="scss">
.tabs {
  @apply flex gap-4 pt-2 pb-6;
  a {
    @apply text-gray-500;
    &.router-link-active {
      @apply font-bold underline underline-offset-4 text-blue-400;
    }
  }
}
</style>
