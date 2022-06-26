<template>
  <nav-bar />
  <div class="DocumentsPage">
    <div class="cover">
      <div class="side-bar">
        <router-link
          v-for="it in ApiDocuments"
          :key="it.path"
          class="item"
          :to="{ name: 'docs-api-' + it.path }"
          :class="{ large: it.isLarge }"
        >
          {{ it.name }}
        </router-link>
      </div>
      <div class="content prose">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script setup>
import NavBar from "../index/views/NavBar.vue";
import { ApiDocuments } from "./apis/apis";
</script>
<script>
export default {
  name: "DocumentsPage",
};
</script>
<style lang="scss">
.DocumentsPage {
  .cover {
    @apply flex container mx-auto;
    .side-bar {
      @apply w-[240px] flex flex-col gap-1;
      .item {
        @apply px-2 py-1 font-semibold capitalize text-sm;
        &.large {
          @apply px-0 text-lg font-extrabold;
        }
        &:hover {
          @apply text-primary-300;
        }
      }
    }
    .content {
      @apply w-full;
    }
  }
}
</style>
