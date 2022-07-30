<template>
  <div class="Documents">
    <div class="side-bar card">
      <div class="header">Documents</div>
      <button class="btn btn-sm btn-text" @click="$refs.modal.show()">
        New Document
      </button>
      <div class="items">
        <template v-if="!fetching">
          <router-link
            v-for="doc in documents"
            :key="doc._id"
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
        </template>
        <template v-if="fetching">
          <div class="item h-8 skeloading"></div>
          <div class="item h-8 skeloading"></div>
          <div class="item h-8 skeloading"></div>
        </template>
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
import Modal from "../../../../components/Modal.vue";
import { useRoute } from "vue-router";
import { Api } from "../../../../lib/api";
import DeleteIcon from "ionicons/dist/svg/trash.svg";
import CreateDocument from "./NewDocument.vue";
import swal from "sweetalert2";

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
      count: null,
      fetching: false,
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
    onNewDocumentCreated(doc) {
      this.fetchData();
      this.$refs.modal.hide();
      this.$router.replace({ name: "document", params: { _id: doc._id } });
    },
    async submit() {
      const { data, status } = await this.api.create(JSON.parse(this.newDoc));
      this.$refs.modal.hide();
      this.newDoc = "";
      await this.fetchData();
    },
    async fetchData() {
      this.fetching = true;
      try {
        const { data } = await this.api.find(
          {},
          {},
          { sort: { createdAt: -1 } }
        );
        this.documents = data;
        this.fetchCount();
      } catch (e) {
        console.error(e);
      } finally {
        this.fetching = false;
      }
    },
    async removeDocument(p) {
      const { isConfirmed } = await swal.fire({
        title: "Delete Document",
        text: "Are you sure?",
        cancelButtonText: "cancel",
        customClass: { confirmButton: "danger", cancelButton: "secondary" },
        confirmButtonText: "Yes, Delete it",
        showCancelButton: true,
      });
      if (!isConfirmed) return;
      const { data } = await this.api.deleteOne({ _id: p._id });
      let { collection, project } = this;
      this.$router
        .replace({ name: "documents", params: { project, collection } })
        .then();
      await this.fetchData();
    },
    async fetchCount() {
      const { data } = await this.api.count();
      this.count = data;
    },
  },
};
</script>

<style lang="scss">
.Documents {
  @apply flex flex-col lg:flex-row gap-4 w-full;
  min-height: 200px;

  .document {
    @apply w-full;
  }

  .new-document {
  }
}
</style>
