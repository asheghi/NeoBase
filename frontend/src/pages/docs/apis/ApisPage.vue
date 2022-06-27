<template>
  <div class="ApisPage">
    <div class="header-text"></div>
    <h1 class="font-extrabold dark:text-white text-2xl mb-8">APIs</h1>
    <div class="items">
      <router-link
        v-for="it in ApiDocuments.filter((it) => !it.isLarge)"
        :key="it.path"
        :to="{ name: 'docs-api-' + it.path }"
        class="item"
      >
        <h1 class="name" v-text="it.name"></h1>
        <p class="desc" v-text="it.desc"></p>
      </router-link>
    </div>
  </div>
</template>
<script setup>
import { ApiDocuments } from "./apis";
</script>
<script>
export default {
  name: "ApisPage",
};
</script>
<style lang="scss">
.ApisPage {
  @apply dark:text-white;
  .items {
    @apply grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3;
    .item {
      @apply transition-all bg-white dark:bg-gray-700 rounded
      no-underline
      shadow border px-6 py-4;
      .name {
        @apply dark:text-white text-2xl mb-4 font-extrabold capitalize;
      }
      .desc {
        @apply opacity-75 dark:text-white;
      }
      &:hover {
        @apply transform scale-[1.05] shadow-lg border-primary;
      }
    }
  }
}
</style>
