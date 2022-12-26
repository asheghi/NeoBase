<template>
  <div class="NewDocument" :class="'mode-' + currentMode">
    <JsonInput v-model="document" />
    <div class="buttons">
      <button
        class="text-primary dark:text-white"
        @click="onCancel"
        v-text="'cancel'"
      />
      <NButton :loading="loading" class="primary" @click="onSave">
        {{ loading ? "Saving" : "Save" }}
      </NButton>
    </div>
  </div>
</template>
<script>
import DocumentEditor from "./DocumentEditor.vue";
import { useRoute } from "vue-router";
import { Api } from "../../../../../lib/api.js";
import { getLogger } from "../../../../../plugins/log.js";
import { computed, ref } from "vue";
import JsonEditor from "./JsonEditor.vue";
import JsonInput from "../../playground/components/JsonInput.vue";
import NButton from "../../../../../components/design-system/N-Button.vue";
import { toast } from "../../../../../plugins/alert.js";

const log = getLogger("create-document");
export default {
  name: "CreateDocument",
  components: { NButton, JsonInput, JsonEditor, DocumentEditor },
  props: {
    doc: {
      type: Object,
      default: () => ({ foo: "bar" }),
    },
    hideId: { type: Boolean, default: false, required: false },
  },
  emits: ["created", "cancel"],
  setup(props) {
    const { project, collection } = useRoute().params;
    const currentMode = ref("json");
    const alternateMode = computed(() =>
      currentMode.value === "json" ? "editor" : "json"
    );
    const toggleMode = () => {
      currentMode.value = alternateMode.value;
    };
    const doc = { ...props.doc };
    const documentId = props.doc._id ? String(props.doc._id) : null;
    const mode = documentId ? "edit" : "create";
    delete doc._id;
    delete doc.createdAt;
    delete doc.updatedAt;
    delete doc.createdBy;
    delete doc.__v;
    const document = ref(doc);
    return {
      documentId,
      mode,
      document,
      project,
      collection,
      api: Api.Documents(project, collection),
      currentMode,
      alternateMode,
      toggleMode,
    };
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    document_id() {
      return this.mode === "create" ? "new ObjectId()" : this.doc._id;
    },
  },
  methods: {
    async createDocument() {
      if (!this.document) {
        log.error("this.document is not defined!", this.document);
        return;
      }
      if ("" in this.document) delete this.document[""];
      try {
        this.loading = true;
        const { data } = await this.api.create(this.document);
        this.$emit("created", data);
        toast("created new document");
      } catch (e) {
        log.error(e);
      } finally {
        this.loading = false;
      }
    },
    async updateDocument() {
      if (!this.document) {
        log.error("this.document is not defined!", this.document);
        return;
      }
      try {
        if ("" in this.document) delete this.document[""];
        const filter = { _id: this.document_id };
        this.loading = true;
        await this.api.updateOne(filter, this.document);
        this.$emit("updated", this.document_id);
        toast("updated document");
      } catch (e) {
        log.error(e);
      } finally {
        this.loading = false;
      }
    },
    onCancel() {
      this.$emit("cancel", true);
    },
    toggleAlternateMode() {
      this.currentMode = this.alternateMode;
    },
    onSave() {
      if (this.mode === "edit") {
        this.updateDocument();
      } else {
        this.createDocument();
      }
    },
    updatedJson(arg) {
      console.log("check arg", arg);
    },
  },
};
</script>
<style lang="scss">
.NewDocument {
  @apply relative;
  min-width: min(90vh, 500px);
  label {
    @apply text-xs opacity-50;
  }
  input,
  select {
    @apply px-2 py-1 text-gray-500 drop-shadow  outline-blue-600 border;
    background: white;
  }
  &.mode-json {
    .border-left {
      @apply hidden;
    }
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
  }
}
</style>
