<template>
  <div class="Documents">
    <div class="side-bar">
      <h1 class="opacity-50">Documents</h1>
      <button class="btn btn-sm btn-text" @click="$refs.modal.show()">New Document</button>
      <router-link class="item"
                   v-for="doc in documents"
                   :to="{name:'document',params:{
                     project,
                     collection,
                     _id:doc._id,
                   }}"
                   v-text="doc._id.substring(10)"
      />
    </div>
    <div class="document">
      <router-view/>
    </div>
    <Modal ref="modal">
      <div class="new-document">
        <div class="form flex flex-col" @keydown.enter="newDocument">
          <div class="form-group">
            <label for="newDoc">New Document</label>
            <textarea
                name="newDoc"
                id="newDoc"
                class="border border-gray-200 p-2 rounded outline-blue-200"
                cols="32"
                rows="10"
                v-model="newDoc"
                placeholder="insert json content here"
            />
          </div>
          <button @click="submit" class="btn">
            Create
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "../../../components/Modal.vue";
import {ax} from "../../../plugins/axios";
import {useRoute} from "vue-router";
import {Api} from "../../../lib/api";

export default {
  name: "ManageDocuments",
  components: {Modal},
  setup() {
    const {project, collection} = useRoute().params;
    return {
      project,
      collection,
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    onNewDocument() {
      this.$refs.modal.show();
    },
    async submit() {
      const {data, status} = await this.api.create(JSON.parse(this.newDoc))
      this.$refs.modal.hide()
      this.newDoc = '';
      await this.fetchData();
    },
    async fetchData() {
      const {data} = await this.api.find();
      this.documents = data;
    },
    async removeDocument(p) {
      const {data} = await this.api.deleteOne({_id: p._id})
      await this.fetchData();
    },
  },
  data() {
    return {
      documents: [],
      newDoc: '',
    }
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
.Documents {
  @apply flex w-full ;
  .side-bar {
    min-width: 220px;
    @apply flex flex-col gap-2 items-start;
    .item {
      @apply py-2 px-4 -mx-4 rounded font-bold uppercase tracking-wide;
      &.router-link-active {
        @apply bg-gray-200;
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
