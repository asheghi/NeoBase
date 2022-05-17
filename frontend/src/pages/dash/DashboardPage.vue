<template>
  <div class="DashboardPage">
    <div class="navbar container mx-auto flex gap-4 py-2 text-lg font-extrabold opacity-50 px-4 mb-4">
      <div class="left">
        <router-link to="/dash">Home</router-link>
        <template v-if="project">
            > {{project}}
        </template>
      </div>
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
  },
  computed:{
    project(){
      return this.$route.params.project;
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
