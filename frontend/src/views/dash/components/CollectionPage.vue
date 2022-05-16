<template>
  <div>
    <div class="new-item">
      <div class="form-group">
        <label>Content JSON:</label>
        <textarea v-model="content"/>
      </div>
      <div class="form-group">
        <button @click="submit">Create</button>
      </div>
      <div class="list">
        <div class="item" v-for="doc in documents" :key="doc._id">
          {{doc}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {ax} from "../../../plugins/axios";

export default {
  name: "CollectionPage",
  data() {
    return {
      content: null,
      documents: null
    }
  },
  mounted() {
    this.fetchDocuments()
  },
  methods: {
    async submit() {
      const {data, status} = await ax.post('/db/johny_depp/tasks/create', JSON.parse(this.content));
      console.log(data);
    },
    async fetchDocuments(){
      const {data} = await ax.get('/db/johny_depp/tasks/find');
      this.documents = data;
    }
  }
}
</script>

<style scoped>

</style>
