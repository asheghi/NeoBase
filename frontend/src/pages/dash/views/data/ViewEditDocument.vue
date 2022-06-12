<template>
  <div class="ViewEditDocument">
    <div class="flex items-center justify-between">
      <div
        class="head opacity-50 px-4 -mx-4 mb-4"
        v-text="doc ? doc._id : 'Document'"
      ></div>
      <div class="icons flex items-center gap-2">
        <button @click="toggleEditMode">Edit</button>
        <button @click="$emit('deleteDocument', doc)">
          <DeleteIcon
            v-if="doc"
            class="fill-red-500 opacity-75"
            width="24"
            height="24"
          />
        </button>
      </div>
    </div>
    <div v-if="currentMode === ModeView">
      <pre v-if="doc"><code>{{ JSON.stringify(doc, null, '\t') }}</code></pre>
    </div>
    <CreateDocument
      v-if="currentMode === ModeEdit"
      hide-id
      :doc="doc"
      @updated="onUpdate"
    />
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { Api } from "../../../../lib/api";
import DeleteIcon from "ionicons/dist/svg/trash.svg";
import CreateDocument from "./NewDocument.vue";
const ModeView = "mode-view";
const ModeEdit = "mode-edit";

export default {
  name: "ViewEditDocument",
  components: { CreateDocument, DeleteIcon },
  beforeRouteUpdate() {
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
      currentMode: ModeView,
      ModeEdit,
      ModeView,
    };
  },
  computed: {
    alternateMode() {
      if (this.currentMode === ModeEdit) return ModeView;
      return ModeEdit;
    },
  },
  mounted() {
    this.fetchDocument();
  },
  methods: {
    async fetchDocument() {
      const { data } = await this.api.findOne({
        _id: this.$route.params._id,
      });
      this.doc = data;
    },
    toggleEditMode() {
      this.currentMode = this.alternateMode;
    },
    onUpdate() {
      this.fetchDocument();
      this.toggleEditMode();
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
