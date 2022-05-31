<template>
  <div class="ViewEditDocument">
    <div class="flex items-center justify-between">
      <div
        class="head opacity-50 px-4 -mx-4 mb-4"
        v-text="doc ? doc._id : 'Document'"
      ></div>
      <div class="icons flex items-center gap-2">
        <DeleteIcon
          v-if="doc"
          class="fill-red-500 opacity-75"
          width="24"
          height="24"
          @click="$emit('deleteDocument', doc)"
        />
      </div>
    </div>
    <div>
      <pre v-if="doc"><code>{{ JSON.stringify(doc, null, '\t') }}</code></pre>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { Api } from "../../../lib/api";
import DeleteIcon from "ionicons/dist/svg/trash.svg";

export default {
  name: "ViewEditDocument",
  components: { DeleteIcon },
  beforeRouteUpdate(to, from) {
    this.doc = null;
    this.fetchDocument();
  },
  setup() {
    const { project, collection, _id } = useRoute().params;
    const api = Api.Documents(project, collection);
    return {
      project,
      collection,
      id: _id,
      api,
    };
  },
  data() {
    return {
      doc: null,
    };
  },
  mounted() {
    this.fetchDocument();
  },
  methods: {
    async fetchDocument() {
      const { data } = await this.api.findOne({
        params: {
          _id: this.$route.params._id,
        },
      });
      this.doc = data;
    },
  },
};
</script>

<style lang="scss">
.ViewEditDocument {
  @apply flex flex-col absolute inset-0 px-4;
  min-height: 400px;
}
</style>
