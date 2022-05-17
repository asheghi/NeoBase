<template>
  <div class="FireStore">
    <div class="collections">
      <div class="head">Collections</div>
      <div class="item">
        <button class="btn btn-text btn-sm" @click="showNewCollectionModal">New Collection</button>
      </div>
      <router-link v-for="col in collections" :key="col"
                   :to="{name:'documents',params:{collection: col.name}}"
                   class="item name"
                   :class="{selected:col.name === collection}"
                   v-text="col.name"></router-link>
    </div>
    <div class="documents" v-if="collection">
      <router-view/>
    </div>
    <div class="select-document" v-if="!collection">
     <div v-if="collections && collections.length">
       select a collection first
     </div>
      <div class="" v-else>
        create a collection first
      </div>
    </div>
    <Modal ref="modal">
      <div class="new-project">
        <div class="form" @keydown.enter="submit">
          <div class="form-group">
            <label for="email">Collection Name</label>
            <input id="email" name="email" v-model="form.name"
                   placeholder="Choose a plural name"
            >
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

import {ax} from "../../../plugins/axios";
import Modal from "../../../components/Modal.vue";

export default {
  name: "FireStore",
  components: {Modal},
  mounted() {
    this.fetchData();
  },
  methods: {
    showNewCollectionModal() {
      this.$refs.modal.show();
    },
    async submit() {
      const {data, status} = await ax.post(`store/__col/${this.project}`, {name: this.form.name})
      this.$refs.modal.hide()
      this.form.name = '';
      await this.fetchData();
    },
    async fetchData() {
      const {data} = await ax.get(`store/__col/${this.project}`);
      this.collections = data;
    },
    async removeProject(p) {
      const {data} = await ax.delete(`store/__col/${this.project}/${p.name}`);
      await this.fetchData();
    }
  },
  data() {
    return {
      form: {
        name: '',
      },
      collections: [],
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
.FireStore {
  @apply flex gap-8;
  .collections {
    @apply flex flex-col gap-1;
    min-width: 220px;
    .item {
      @apply w-full px-4 -mx-4  py-2 text-lg ;
      &.router-link-exact-active {
        @apply font-bold bg-gray-200;
      }
    }
  }

  .select-document{
    @apply w-full flex justify-center items-center opacity-50;
    min-height: 400px;
  }
  .modal-box {
    .new-project {
      @apply flex flex-col gap-4;
      min-width: 360px;
    }

    .form {
      @apply flex items-center gap-4 w-full;
      .form-group {
        @apply flex flex-col gap-2 w-full;
        label {
          @apply text-sm opacity-50;
        }

        input {
          @apply px-4 w-full py-2 rounded bg-gray-100 outline-blue-500;
        }
      }

      .btn {
        @apply bg-blue-500 text-white px-4 py-2 rounded mt-auto m-0;
      }

    }
  }
}

</style>
