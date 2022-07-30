<template>
  <div class="DashboardPage">
    <DashNavBar />
    <div class="dash-content-wrapper" :class="{ 'hide-nav': !project }">
      <router-view class="dash-content" />
    </div>
  </div>
</template>

<script setup>
import DashNavBar from "./views/components/DashNavbar.vue";
</script>
<script>
import { Api } from "../../lib/api";
import { removeAccountToken } from "../../lib/auth";

export default {
  async beforeRouteEnter(to, from, next) {
    try {
      const { data, status } = await Api.me();
    } catch (e) {
      console.error(e);
      return next("/login");
    }
    next();
  },
  computed: {
    project() {
      return this.$route.params.project;
    },
    showHome() {
      const routeName = this.$route.name;
      return routeName;
    },
  },
  methods: {
    logout() {
      removeAccountToken();
      this.$router.replace("/login");
    },
  },
};
</script>

<style lang="scss">
.DashboardPage {
  @apply bg-gray-200 dark:bg-gray-700;
  --nav-height: 57px;
  --side-width: 256px;

  .dash-content-wrapper {
    @apply left-0 bg-gray-100 w-full fixed right-0 px-4 bottom-0 z-0 dark:bg-gray-700;
    top: var(--nav-height);
    @screen lg {
      left: var(--side-width);
      width: calc(100vw - var(--side-width));
      &.hide-nav {
        @apply left-0 w-full;
      }
    }

    .dash-content {
      @apply container w-full mx-auto;
    }
  }
  .card {
    @apply bg-white shadow dark:bg-gray-600
    dark:text-white dark:border-gray-500 rounded-sm;

    .header {
      @apply bg-primary font-bold tracking-wide uppercase rounded-sm text-white w-full px-4 py-2;
    }
  }
}
</style>
