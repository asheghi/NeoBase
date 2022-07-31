<template>
  <div class="ViewEditDocument card">
    <div class="header flex gap-4">
      Document
      <span class="opacity-50 -ml-2"> ({{ docId }}) </span>
      <span class="ml-auto"></span>
      <NButton v-if="doc" class="" @click="toggleEditMode">
        <IconEdit />
      </NButton>
      <NButton v-if="doc" class="" @click="$emit('deleteDocument', doc)">
        <DeleteIcon />
      </NButton>
    </div>
    <div v-if="currentMode === ModeView">
      <pre
        v-if="doc"
        class="p-4"
      ><code>{{ JSON.stringify(doc, null, '\t') }}</code></pre>
      <div v-if="!doc" class="skeloading"></div>
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
import CreateDocument from "./components/NewDocument.vue";
import NButton from "../../../../components/design-system/N-Button.vue";
import IconEdit from "@mdi/svg/svg/pen.svg";

const ModeView = "mode-view";
const ModeEdit = "mode-edit";

export default {
  name: "ViewEditDocument",
  components: { NButton, CreateDocument, DeleteIcon, IconEdit },
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
      fetching: false,
    };
  },
  computed: {
    alternateMode() {
      if (this.currentMode === ModeEdit) return ModeView;
      return ModeEdit;
    },
    docId() {
      return this.$route?.params?._id;
    },
  },
  mounted() {
    this.fetchDocument();
  },
  methods: {
    async fetchDocument() {
      try {
        this.fetching = true;
        const { data } = await this.api.findOne({
          _id: this.docId,
        });
        this.doc = data;
      } catch (e) {
        console.error(e);
      } finally {
        // this.fetching = false;
      }
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
  @apply flex flex-col;

  .skeloading {
    @apply w-full min-h-[180px];
  }
}
</style>
