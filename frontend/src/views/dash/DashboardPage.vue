<template>
  <div class="DashboardPage">
    <div class="navbar container mx-auto flex gap-4 py-2 text-orange-700 px-4 mb-4">
      <router-link to="/">Home</router-link>
      <router-link to="/login" class="ml-auto">Logout</router-link>
    </div>
    <div class="nested-route-cover">
     <router-view />
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.DashboardPage{
  .nested-route-cover{
    @apply container mx-auto px-4;
  }
}

</style>
