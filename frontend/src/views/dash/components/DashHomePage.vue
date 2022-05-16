<template>
  <div class="DashHomePage">
    <div class="collections">
      <div class="header">
        <h1>Collections</h1>
        <button>
          Create Collection
        </button>
      </div>
      <div class="table">
        <CollectionPage />
      </div>
    </div>
  </div>
</template>

<script>
import CollectionPage from "./CollectionPage.vue";
export default {
  name: "DashHomePage",
  components: {CollectionPage},
}
</script>

<style scoped>

</style>
