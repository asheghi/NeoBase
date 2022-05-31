<template>
  <div class="CreateDocument">
    <div class="document-id">
      <label for="document_id">Document ID</label>
      <br />
      <input
        id="document_id"
        disabled="disabled"
        type="text"
        :value="document_id"
        placeholder="document id"
      />
    </div>
    <br />
    <DocumentEditor v-model="document" />
    <div class="buttons">
      <button class="btn btn-text btn-sm" @click="onCancel" v-text="'cancel'" />
      <button class="btn save" @click="createDocument" v-text="'Save'" />
    </div>
    <div class="border-left"></div>
  </div>
</template>
<script>
import DocumentEditor from "./components/DocumentEditor.vue";
import { useRoute } from "vue-router";
import { Api } from "../../../lib/api";
import { getLogger } from "../../../plugins/log";
const log = getLogger("create-document");
export default {
  name: "CreateDocument",
  components: { DocumentEditor },
  emits: ["created", "cancel"],
  setup() {
    const { project, collection } = useRoute().params;
    const api = Api.Documents(project, collection);
    return {
      project,
      collection,
      api,
    };
  },
  data() {
    return {
      document: {
        "": "",
      },
    };
  },
  computed: {
    document_id() {
      return this.mode === "create" ? "new ObjectId()" : this.document._id;
    },
    mode() {
      return "create";
    },
  },
  methods: {
    async createDocument() {
      if (!this.document) {
        log.error("this.document is not defined!", this.document);
        return;
      }
      if ("" in this.document) delete this.document[""];
      console.log("before create", this.document);
      const { data, status } = await this.api.create(this.document);
      this.$emit("created", data);
    },
    onCancel() {
      this.$emit("cancel", true);
    },
  },
};
</script>
<style lang="scss">
.CreateDocument {
  @apply relative;
  min-width: 600px;
  min-height: 220px;
  overflow: hidden;
  label {
    @apply text-xs opacity-50;
  }
  input,
  select {
    @apply px-2 py-1 text-gray-500 drop-shadow rounded outline-blue-600 border;
    background: white;
  }
  .border-left {
    @apply absolute bottom-0;
    background-image: linear-gradient(
      rgba(black, 0.5) 33%,
      rgba(255, 255, 255, 0) 0%
    );
    background-position: right;
    background-size: 2px 6px;
    background-repeat: repeat-y;
    top: 59px;
    left: 0.75rem;
    width: 2px;
  }
  .document-id {
    z-index: 2;
  }
  .buttons {
    @apply flex gap-4 items-center justify-end mt-8;
    .save {
      @apply bg-blue-600 text-white px-2 py-1 rounded;
    }
  }
}
</style>
