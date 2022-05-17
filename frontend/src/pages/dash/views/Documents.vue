<template>
  <div class="Documents">
    <div class="">
      <h1>Documents</h1>
      <button class="btn btn-sm btn-text">New Document</button>
      <router-link class="item" v-for="doc in documents" :to="{name:'document',params:{}}" />
    </div>
  </div>
</template>

<script>
import Modal from "../../../components/Modal.vue";
import {ax} from "../../../plugins/axios";

export default {
  name: "ManageDocuments",
  components: {Modal},
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
      const {data} = await ax.get('documents');
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
  computed:{
    project(){
      return this.$route.params.project;
    },
    collection(){
      return this.$route.params.collection;
    }
  }
}
</script>

<style lang="scss">
.ManageDocuments {
  max-width: 600px;
  margin: 0 auto;

  .head {
    @apply flex justify-between items-center;
    .header-text {
      @apply font-bold text-lg;
    }

    .btn {
      @apply bg-blue-600 text-white px-4 py-2
      rounded font-bold text-sm ;
    }
  }

  .list {
    @apply mt-4;
    .item {
      @apply py-2 flex items-center justify-between;

      .btn-danger {
        @apply bg-red-600 text-white px-4 py-1 rounded font-bold;
      }
    }
  }

  .modal-box {
    .new-document {
      @apply flex flex-col gap-4;
      min-width: 360px;
    }

    .form {
      .form-group {
        @apply flex flex-col gap-2;
        label {
          @apply text-sm opacity-50;
        }

        input {
          @apply px-4 py-2 rounded bg-gray-100 outline-blue-500;
        }
      }

      .btn {
        @apply bg-blue-600 text-white px-4 py-2
        rounded font-bold text-sm w-full mt-4;
      }

    }
  }
}

</style>
