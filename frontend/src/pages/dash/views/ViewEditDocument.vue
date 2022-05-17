<template>
  <div class="ViewEditDocument">
    <div class="head bg-red-400" v-text="doc ? doc._id : 'Document'">
    </div>
    <div>
      <pre v-if="doc"><code>{{ JSON.stringify(doc, null, '\t') }}</code></pre>
    </div>
  </div>
</template>

<script>
import {useRoute} from "vue-router";
import {ax} from "../../../plugins/axios";

export default {
  name: "ViewEditDocument",
  setup() {
    const {project, collection, _id} = useRoute().params;
    return {
      project,
      collection,
      _id,
    }
  },
  mounted() {
    this.fetchDocument()
  },
  methods: {
    async fetchDocument() {
      const {data} = await ax.get(`store/${this.project}/${this.collection}/findOne`,
          {
            params: {
              _id: this.$route.params._id,
            }
          });
      this.doc = data;
    }
  },
  data() {
    return {
      doc: null,
    }
  }
}
</script>

<style lang="scss">
.ViewEditDocument {
  @apply flex justify-center items-center;
  min-height: 400px;
}

</style>
