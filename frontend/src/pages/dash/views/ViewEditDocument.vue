<template>
  <div>
      view or edit document:{{_id}}
  </div>
</template>

<script>
import {useRoute} from "vue-router";

export default {
  name:"ViewEditDocument",
  setup(){
    const {project,collection,_id} = useRoute().params;
    return {
      project,
      collection,
      _id,
    }
  }
}
</script>

<style scoped>

</style>
