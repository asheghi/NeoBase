<template>
  <div class="Documents">
    <div class="side-bar">
      <h1 class="opacity-50">Documents</h1>
      <button class="btn btn-sm btn-text">New Document</button>
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
      const {data, status} = await ax.post('documents', {name: this.form.name})
      this.$refs.modal.hide()
      this.form.name = '';
      await this.fetchData();
    },
    async fetchData() {
      const {data} = await ax.get(`store/${this.project}/${this.collection}/find`);
      this.documents = data;
    },
    async removeDocument(p) {
      const {data} = await ax.delete('documents/' + p.name);
      await this.fetchData();
    }
  },
  data() {
    return {
      form: {
        name: '',
      },
      documents: [],
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
    .item{
      @apply py-2 px-4 -mx-4 rounded font-bold uppercase tracking-wide;
      &.router-link-active{
        @apply bg-gray-200;
      }
    }
  }
  .document{
    @apply  w-full;
  }
}

</style>
