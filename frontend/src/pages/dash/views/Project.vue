<template>
  <div class="Project">
    <div class="tabs">

    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "ProjectView",
  components: {},
};
</script>

<style lang="scss">
.tabs {
  @apply flex flex-wrap pt-2 py-4;
  .tab {
    @apply text-gray-500 flex items-center gap-1 border-b
    transition-all border-gray-200 px-2 py-2 font-bold
    opacity-75;
    &.router-link-active,
    &.active {
      @apply text-primary opacity-100
      border-b-4 border-primary;
      svg {
        @apply fill-primary;
      }
      &:hover {
        @apply opacity-100;
      }
    }
    &:hover {
      @apply fill-primary text-primary opacity-50 border-b-4 border-primary;
    }
  }
}
</style>
