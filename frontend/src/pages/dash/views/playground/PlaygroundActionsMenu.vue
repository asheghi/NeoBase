<template>
  <div class="PlaygroundActionsMenu">
    <div class="side-menu card items">
      <div class="header">Actions</div>
      <button
        v-for="item in items"
        :key="item.name"
        class="item"
        :class="{ selected: selected === item.name }"
        @click="onItemSelected(item.name)"
      >
        {{ item.name }}
      </button>
    </div>
  </div>
</template>
<script>
import { document_actions } from "./actions.js";

export default {
  name: "PlaygroundActionsMenu",
  props: {
    selected: {
      type: String,
      required: false,
    },
  },
  emits: ["select"],
  computed: {
    items() {
      return Object.keys(document_actions).map((key) => ({
        name: key,
        ...document_actions[key],
      }));
    },
  },
  methods: {
    onItemSelected(arg) {
      this.$emit("select", arg);
    },
  },
};
</script>
<style lang="scss">
.PlaygroundActionsMenu {
  .items {
    @apply flex flex-col min-w-[200px];
    .item {
      @apply px-4 py-2 capitalize text-left hover:bg-gray-200 dark:hover:bg-gray-500 transition;
      &.selected {
        @apply bg-gray-200 dark:bg-gray-500;
      }
    }
  }
}
</style>
