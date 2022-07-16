<template>
  <div class="Project">
    <div class="tabs">
      <router-link
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab"
        :to="tab.to"
      >
        <component :is="tab.icon" v-if="tab.icon" />
        <div class="label" v-text="tab.label" />
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script setup>
import IconData from "@mdi/svg/svg/database.svg";
import IconUsers from "@mdi/svg/svg/account-group.svg";
import IconAccess from "@mdi/svg/svg/account-lock.svg";
import IconPlayground from "@mdi/svg/svg/gamepad.svg";
const tabs = [
  {
    label: "Data",
    icon: IconData,
    to: { name: "collections" },
  },
  {
    label: "Users",
    icon: IconUsers,
    to: { name: "auth" },
  },
  {
    label: "Access Control",
    icon: IconAccess,
    to: { name: "access" },
  },
  {
    label: "Playground",
    icon: IconPlayground,
    to: { name: "playground" },
  },
];
</script>
<script>
export default {
  name: "ProjectView",
  components: {},
};
</script>

<style lang="scss">
.tabs {
  @apply flex flex-wrap pt-2 py-4;
  .tab {
    @apply text-gray-500 flex items-center gap-1 border-b
    transition-all border-gray-200 px-2 py-2 font-bold
    opacity-75;
    &.router-link-active,
    &.active {
      @apply text-primary opacity-100
      border-b-4 border-primary;
      svg {
        @apply fill-primary;
      }
      &:hover {
        @apply opacity-100;
      }
    }
    &:hover {
      @apply fill-primary text-primary opacity-50 border-b-4 border-primary;
    }
  }
}
</style>
