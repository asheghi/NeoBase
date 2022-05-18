<template>
  <div class="ViewEditDocument">
    <div class="head font-bold opacity-50 px-4 -mx-4 mb-4" v-text="doc ? doc._id : 'Document'">
    </div>
    <div>
      <pre v-if="doc"><code>{{ JSON.stringify(doc, null, '\t') }}</code></pre>
    </div>
  </div>
</template>

<script>
import {useRoute} from "vue-router";
import {ax} from "../../../plugins/axios";
import {Api} from "../../../lib/api";

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
      const {data} = await this.api.findOne({
        _id: this.$route.params._id,
      });
      this.doc = data;
    }
  },
  data() {
    return {
      doc: null,
    }
  },
  beforeRouteUpdate(to, from) {
    this.doc = null;
    this.fetchDocument();
  },
  computed: {
    api() {
      return Api.Documents(this.project, this.collection);
    },
    project() {
      return this.$route.params.project;
    },
    collection() {
      return this.$route.params.collection;
    }
  }
}
</script>

<style lang="scss">
.ViewEditDocument {
  @apply flex flex-col;
  min-height: 400px;
}

</style>
