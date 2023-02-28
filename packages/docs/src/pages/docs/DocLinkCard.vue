<template>
  <router-link
    :key="doc.path"
    class="doc-link-card"
    :to="{ name: 'docs-' + doc.path }"
  >
    <h1 class="name" v-text="doc.name"></h1>
    <p class="desc" v-text="doc.desc"></p>
  </router-link>
</template>

<script>
export default {
  name: "DocLinkCard",
  props: {
    doc: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss">
.doc-link-card {
  @apply bg-red-600 transition-all bg-white dark:bg-gray-700 rounded
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
</style>
