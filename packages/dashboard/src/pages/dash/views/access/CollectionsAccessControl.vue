<template>
  <div class="CollectionsAccessControl">
    <div class="card side-bar">
      <div class="header">Collections</div>
      <div class="items">
        <template v-if="!fetching">
          <router-link
            v-for="col in collections"
            :key="col"
            :to="{ name: 'access-config', params: { collection: col.name } }"
            class="item name"
            :class="{ selected: col.name === collection }"
          >
            {{ col.name }}
          </router-link>
          <div v-if="!collections.length" class="text-center text-gray-500">
            No Collection yet
          </div>
        </template>
        <template v-if="fetching">
          <div class="item h-8 skeloading"></div>
          <div class="item h-8 skeloading"></div>
          <div class="item h-8 skeloading"></div>
        </template>
      </div>
    </div>
    <div v-if="collection" class="document w-full h-full relative">
      <transition name="fade">
        <router-view :key="collection" />
      </transition>
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
      fetching: false,
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
  watch: {
    "$route.params.project": {
      handler(n, o) {
        if (n) this.fetchData();
      },
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.fetching = true;
      try {
        const { data } = await Api.Collections(this.project).list();
        this.collections = data;
      } catch (e) {
        console.error(e);
      } finally {
        this.fetching = false;
      }
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
    .items {
      @apply w-full flex flex-col gap-2;
    }

    .item {
      @apply relative pr-12 flex items-center transition-all ease-linear w-full dark:text-white text-gray-600 pl-4 py-2;
      &.router-link-active {
        @apply bg-gray-100 text-black dark:text-white dark:bg-gray-500;
        &:hover {
          .drop {
            @apply block opacity-75;
          }
        }
      }
    }
    &.showingUser {
      @apply hidden xl:flex;
    }
  }
}
</style>
