<template>
  <div class="ApisPage">
    <div class="header-text"></div>
    <h1 class="font-extrabold dark:text-white text-2xl mb-8">APIs</h1>
    <div class="items">
      <DocLinkCard
        v-for="doc in ApiDocuments.filter((it) => it.page && it.level !== 0)"
        :key="doc.name"
        class="item"
        :doc="doc"
      />
    </div>
  </div>
</template>
<script setup>
import { ApiDocuments } from "./apis";
import DocLinkCard from "../DocLinkCard.vue";
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
  }
}
</style>
