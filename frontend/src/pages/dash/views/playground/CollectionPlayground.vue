<template>
  <div class="CollectionPlayground">
    <div class="header"></div>
    <div class="actions">
      <router-link
        v-for="(ac, index) in actions"
        :key="index"
        :to="ac.to"
        class="action"
      >
        <div class="label" v-text="ac.name"></div>
      </router-link>
    </div>
    <div v-if="!actions || !collection" class="text-center py-32">
      <div v-if="!collection">select a collection first</div>
      <div v-if="!action">select a action</div>
    </div>
    <router-view :key="collection" />
  </div>
</template>
<script setup>
import { useRoute } from "vue-router";
import { computed } from "vue";
import { document_actions } from "./actions";
const route = useRoute();

const actions = Object.values(document_actions).map((it) => {
  it.to = {
    name: "action-playground",
    params: { ...route.params, action: it.name },
  };
  return it;
});

const collection = computed(() => route.params.collection);
const action = computed(() => route.params.action);
</script>
<script>
export default {
  name: "CollectionPlayground",
};
</script>
<style lang="scss">
.CollectionPlayground {
  .actions {
    @apply flex justify-start gap-4 py-2;
    .action {
      @apply capitalize px-2 py-2 rounded font-bold;
      &.router-link-active {
        @apply text-primary;
      }
    }
  }
}
</style>
