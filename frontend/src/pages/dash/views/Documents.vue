<template>
  <div class="Documents">
    <div class="side-bar">
      <h1 class="head">Documents</h1>
      <button class="btn btn-sm btn-text" @click="$refs.modal.show()">New Document</button>
      <div class="items">
        <router-link class="item"
                     v-for="doc in documents"
                     :to="{name:'document',params:{
                     project,
                     collection,
                     _id:doc._id,
                   }}"
        >
          {{doc._id.substring(10)}}
          <div @click="removeDocument(doc)" class="drop">
            <DeleteIcon class="fill-red-500 opacity-75" width="24" height="24"/>
          </div>
        </router-link>
      </div>
    </div>
    <div class="document relative">
      <transition name="fade">
        <router-view :key="doc"/>
      </transition>
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
import {useRoute} from "vue-router";
import {Api} from "../../../lib/api";
import DeleteIcon from 'ionicons/dist/svg/trash.svg'

export default {
  name: "ManageDocuments",
  components: {Modal,DeleteIcon},
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
      let {collection, project} = this;
      this.$router.replace({name:'documents',params:{ project,collection}}).then();
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
    },
    doc(){
      return this.$route.params._id;
    }
  }
}
</script>

<style lang="scss">
.Documents {
  @apply flex w-full absolute inset-0;
  .side-bar{
    .items{
      .item{
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
