<template>
  <div class="DashboardPage">
    <div
      class="navbar container mx-auto flex gap-4 py-2 text-lg opacity-50 px-4"
    >
      <div class="left">
        <router-link v-if="showHome" to="/dash" class="link">
          <icon-home />
          Home
        </router-link>
        <ChevronRight v-if="project" width="16" height="16" />
        <template v-if="project"> {{ project }} </template>
      </div>
      <router-link to="/login" class="ml-auto" @click="logout"
        >Logout</router-link
      >
    </div>
    <div class="nested-route-cover">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import IconHome from "@mdi/svg/svg/home.svg";
</script>
<script>
import { ax } from "../../plugins/axios";
import { Api } from "../../lib/api";
import { removeAccountToken } from "../../lib/auth";
import ChevronRight from "ionicons/dist/svg/chevron-forward.svg";

export default {
  components: {
    ChevronRight,
  },
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
  .left {
    @apply flex items-center gap-1;
    .link {
      @apply flex gap-1 items-center transition-all;
      &:hover {
        @apply fill-primary text-primary;
      }
    }
  }
  .nested-route-cover {
    @apply container mx-auto px-4;
  }
}
</style>
