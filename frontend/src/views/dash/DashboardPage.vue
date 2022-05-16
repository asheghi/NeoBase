<template>
  <div class="DashboardPage">
    <div class="navbar container mx-auto flex gap-4 py-2 text-orange-700 px-4 mb-4">
      <router-link to="/">Home</router-link>
      <router-link to="/login" class="ml-auto" @click="logout">Logout</router-link>
    </div>
    <div class="nested-route-cover">
     <router-view />
    </div>
  </div>
</template>

<script>
import {ax} from "../../plugins/axios";

export default {
  async beforeRouteEnter (to, from, next) {
    try {
      const {data, status} = await ax.get('auth/me')
    } catch (e) {
      console.error(e);
      return next('/login')
    }
    next()
  },
  methods: {
    logout() {
      localStorage.removeItem('x-wf-auth');
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="scss">
.DashboardPage{
  .nested-route-cover{
    @apply container mx-auto px-4;
  }
}

</style>
