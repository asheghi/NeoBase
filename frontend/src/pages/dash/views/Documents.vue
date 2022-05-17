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
            <label for="">New Document</label>
            <textarea
                class="border border-gray-200 p-2 rounded outline-blue-200"
                cols="32"
                rows="10"
                id="email" name="email" v-model="newDoc"
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
      const {data, status} = await ax.post(`store/${this.project}/${this.collection}/create`, JSON.parse(this.newDoc))
      this.$refs.modal.hide()
      this.newDoc = '';
      await this.fetchData();
    },
    async fetchData() {
      const {data} = await ax.get(`store/${this.project}/${this.collection}/find`);
      this.documents = data;
    },
    async removeDocument(p) {
      const {data} = await ax.delete('documents/' + p.name);
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
