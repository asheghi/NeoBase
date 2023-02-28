<template>
  <div class="Tabs">
    <button
      v-for="item in items"
      :key="item"
      :class="{ active: item === modelValue }"
      class="item"
      @click="onSelect(item)"
      v-text="item"
    />
  </div>
</template>

<script>
export default {
  name: "Tabs",
  props: {
    items: { type: Array, default: () => [], required: true },
    modelValue: { type: String, default: "", required: true },
  },
  methods: {
    onSelect(item) {
      this.$emit("update:modelValue", item);
    },
  },
};
</script>

<style lang="scss">
.Tabs {
  @apply flex gap-2 py-2;
  .item {
    @apply px-2 py-1;
    &.active {
      @apply font-bold;
    }
  }
}
</style>
