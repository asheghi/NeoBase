<template>
  <div class="DashboardPage">
    <div
      class="navbar px-10 pt-4 container mx-auto flex gap-4 py-2 text-lg px-4"
    >
      <div class="left">
        <router-link to="/dash">Todos</router-link>
      </div>
      <div class="ml-auto flex items-center gap-4 text-gray-400">
        <div v-text="user?.email"></div>
        <router-link to="/login" class="text-red-800" @click="logout"
          >Logout</router-link
        >
      </div>
    </div>
    <div class="nested-route-cover">
      <router-view />
    </div>
  </div>
</template>

<script>
import { removeAccountToken } from "../../lib/auth";
import { Auth } from "../../lib/client";

export default {
  components: {},
  async beforeRouteEnter(to, from, next) {
    try {
      const { data } = await Auth.me();
      next((vm) => {
        vm.user = data;
      });
    } catch (e) {
      console.error(e);
      return next("/login");
    }
  },
  data() {
    return {
      user: null,
    };
  },
  computed: {
    project() {
      return this.$route.params.project;
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
  }
  .nested-route-cover {
    @apply container mx-auto px-4;
  }
}
</style>
