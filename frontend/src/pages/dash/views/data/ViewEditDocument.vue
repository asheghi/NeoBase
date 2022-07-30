<template>
  <div class="ViewEditDocument card">
    <div class="header flex gap-4">
      Document
      <span class="opacity-50 -ml-2">
        {{ doc && "(" + doc._id + ")" }}
      </span>
      <span class="ml-auto"></span>
      <NButton class="" @click="toggleEditMode">
        <IconEdit />
      </NButton>
      <NButton class="" @click="$emit('deleteDocument', doc)">
        <DeleteIcon v-if="doc" />
      </NButton>
    </div>
    <div v-if="currentMode === ModeView" class="p-4">
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
  min-height: 200px;
  @apply flex flex-col;
  .header {
    svg {
      @apply w-[24px] h-[24px];
    }
    button {
      @apply p-0 m-0 opacity-50 hover:opacity-100 fill-white;
    }
  }
}
</style>
