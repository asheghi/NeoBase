<template>
  <div class="CollectionsAccessControl">
    <div class="side-bar">
      <div class="head">Access Collection</div>
      <div class="items">
        <router-link
          v-for="col in collections"
          :key="col"
          :to="{ name: 'access-config', params: { collection: col.name } }"
          class="item name"
          :class="{ selected: col.name === collection }"
        >
          {{ col.name }}
        </router-link>
      </div>
    </div>
    <div v-if="collection" class="document w-full h-full relative">
      <transition name="fade">
        <router-view :key="collection" />
      </transition>
    </div>
    <div v-if="!collection" class="select-document">
      <div v-if="collections && collections.length">
        select a collection first
      </div>
      <div v-else class="">create a collection first</div>
    </div>
  </div>
</template>

<script>
import { Api } from "../../../../lib/api";

export default {
  name: "CollectionsAccessControl",
  data() {
    return {
      form: {
        name: "",
      },
      collections: [],
    };
  },
  computed: {
    project() {
      return this.$route.params.project;
    },
    collection() {
      return this.$route.params.collection;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const { data } = await Api.Collections(this.project).list();
      this.collections = data;
    },
  },
};
</script>

<style lang="scss">
.CollectionsAccessControl {
  @apply flex gap-2;
  .side-bar {
    min-width: 240px;
    @apply flex flex-col gap-2 items-start;
    .head {
      @apply bg-gray-100 w-full flex gap-1 px-2 py-2 rounded;
      .icon {
        @apply fill-gray-500;
      }
    }
    .btn {
      @apply flex items-center justify-between gap-1 w-full;
    }
    .items {
      @apply w-full flex flex-col gap-2;
    }

    .item {
      @apply relative flex items-center transition-all ease-linear w-full   text-gray-600 px-2 py-2;
      &.router-link-active {
        @apply bg-gray-100 text-black;
        &:hover {
          .drop {
            @apply block opacity-75;
          }
        }
      }

      .drop {
        @apply absolute right-4 hidden text-red-500 text-sm font-bold;
      }
    }
  }
}
</style>
