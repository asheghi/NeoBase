<template>
  <div class="DocumentsPage">
    <nav-bar />
    <div class="cover px-6">
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
    @apply flex container mx-auto gap-4;
    .side-bar {
      @apply hidden md:flex min-w-[240px] flex-col gap-1;
      .item {
        @apply px-2 py-1 font-semibold
        capitalize text-sm no-underline;
        text-decoration: none;
        &.large {
          @apply px-0 text-lg font-extrabold;
        }
        &:hover {
          @apply text-primary-300;
        }
      }
    }
    .content {
      @apply w-full xl:min-w-[800px] self-stretch dark:text-white;
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      strong,
      a,
      code {
        @apply dark:text-white;
      }
      table {
        thead {
          tr {
            th {
              @apply whitespace-nowrap dark:text-white;
            }
          }
        }
      }
      max-width: 100vw;
    }
  }

  .prose :where(code):not(:where([class~="not-prose"] *))::before {
    content: "";
  }
  .prose :where(code):not(:where([class~="not-prose"] *))::after {
    content: "";
  }
  .prose code {
    @apply font-normal bg-gray-200 px-1 py-1 rounded dark:text-white dark:bg-gray-500;
  }
}
</style>
