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
      @apply container w-full mx-auto overflow-auto pt-6;
      height: calc(100vh - var(--nav-height));
    }
  }
  .card {
    @apply bg-white shadow dark:bg-gray-600
    dark:text-white dark:border-gray-500 rounded-sm;
    height: fit-content;

    .header {
      @apply bg-primary font-bold tracking-wide uppercase rounded-sm text-white w-full px-4 py-2;

      svg {
        @apply w-[24px] h-[24px];
      }
      button {
        @apply p-0 m-0 opacity-50 hover:opacity-100 fill-white;
      }
    }
  }
  input,
  textarea {
    @apply dark:bg-gray-500 dark:text-white;
  }
}
.swal2-container {
  .swal2-modal {
    width: fit-content;
    @apply px-4 py-2 dark:bg-gray-700 dark:text-white;
    min-width: 400px;
  }
  .swal2-title {
    @apply text-base text-left m-0 px-0 py-4;
  }
  .swal2-html-container {
    @apply text-left m-0 p-0 text-base font-normal opacity-75;
  }
  .swal2-actions {
    @apply justify-start w-full flex-row-reverse;
    button {
      @apply px-2 py-1 font-bold capitalize;
    }
    .danger {
      @apply bg-transparent text-red-500;
    }
    .secondary {
      @apply text-gray-500 dark:text-gray-300 bg-transparent outline-gray-400;
    }
  }
}
</style>
