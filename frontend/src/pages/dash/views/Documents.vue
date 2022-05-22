<template>
  <div class="Documents">
    <div class="side-bar">
      <h1 class="head">Documents</h1>
      <button class="btn btn-sm btn-text" @click="$refs.modal.show()">
        New Document
      </button>
      <div class="items">
        <router-link
          v-for="doc in documents"
          class="item"
          :to="{
            name: 'document',
            params: {
              project,
              collection,
              _id: doc._id,
            },
          }"
        >
          {{ doc._id.substring(10) }}
          <div class="drop" @click="removeDocument(doc)">
            <DeleteIcon
              class="fill-red-500 opacity-75"
              width="24"
              height="24"
            />
          </div>
        </router-link>
      </div>
    </div>
    <div class="document relative">
      <transition name="fade">
        <router-view :key="doc" @deleteDocument="removeDocument" />
      </transition>
    </div>
    <Modal ref="modal">
      <div class="new-document">
        <CreateDocument
          @created="onNewDocumentCreated"
          @cancel="$refs.modal.hide()"
        />
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "../../../components/Modal.vue";
import { useRoute } from "vue-router";
import { Api } from "../../../lib/api";
import DeleteIcon from "ionicons/dist/svg/trash.svg";
import CreateDocument from "./CreateDocument.vue";

export default {
  name: "ManageDocuments",
  components: { CreateDocument, Modal, DeleteIcon },
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
      documents: [],
      newDoc: "",
    };
  },
  computed: {
    doc() {
      return this.$route.params._id;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    onNewDocument() {
      this.$refs.modal.show();
    },
    onNewDocumentCreated() {
      this.fetchData();
      this.$refs.modal.hide();
    },
    async submit() {
      const { data, status } = await this.api.create(JSON.parse(this.newDoc));
      this.$refs.modal.hide();
      this.newDoc = "";
      await this.fetchData();
    },
    async fetchData() {
      const { data } = await this.api.find();
      this.documents = data;
    },
    async removeDocument(p) {
      const { data } = await this.api.deleteOne({ _id: p._id });
      let { collection, project } = this;
      this.$router
        .replace({ name: "documents", params: { project, collection } })
        .then();
      await this.fetchData();
    },
  },
};
</script>

<style lang="scss">
.Documents {
  @apply flex w-full absolute inset-0;
  .side-bar {
    .items {
      .item {
      }
    }
  }

  .document {
    @apply w-full;
  }

  .new-document {
  }
}
</style>
