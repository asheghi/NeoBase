<template>
  <div class="FireStore">
    <div class="side-bar">
      <div class="head">
        Collections</div>
      <button class="btn btn-text btn-sm" @click="showNewCollectionModal">
        New Collection
      </button>
      <div class="items">

        <router-link v-for="col in collections" :key="col"
                     :to="{name:'documents',params:{collection: col.name}}"
                     class="item name"
                     :class="{selected:col.name === collection}"
        >
          {{ col.name }}
          <div @click="removeCollection(col)" class="drop">
            <DeleteIcon class="fill-red-500 opacity-75" width="24" height="24"/>
          </div>
        </router-link>
      </div>
    </div>
    <div class="documents w-full relative" v-if="collection">
      <transition name="fade">
        <router-view :key="collection"/>
      </transition>
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

import Modal from "../../../components/Modal.vue";
import {Api} from "../../../lib/api";
import DeleteIcon from 'ionicons/dist/svg/trash.svg'
import CreateIcon from 'ionicons/dist/svg/pencil.svg'

export default {
  name: "Collections",
  components: {Modal, DeleteIcon, CreateIcon},
  mounted() {
    this.fetchData();
  },
  methods: {
    showNewCollectionModal() {
      this.$refs.modal.show();
    },
    async submit() {
      const {data, status} = await Api.Collections(this.project).create({name: this.form.name})
      this.$refs.modal.hide()
      this.form.name = '';
      await this.fetchData();
    },
    async fetchData() {
      const {data} = await Api.Collections(this.project).list();
      this.collections = data;
    },
    async removeCollection(p) {
      const {data} = await Api.Collections(this.project).delete(p.name);
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
  @apply flex gap-2;
  .side-bar {
    min-width: 240px;
    @apply flex flex-col gap-2 items-start ;
    .head{
      @apply bg-gray-100 w-full flex gap-1 px-2 py-2 rounded;
      .icon{
        @apply fill-gray-500;
      }
    }
    .btn{
      @apply flex items-center justify-between gap-1 w-full;
    }
    .items {
      @apply w-full flex flex-col gap-2;
    }

    .item {
      @apply relative flex items-center transition-all ease-linear w-full rounded-lg text-gray-600 px-2 py-2;
      &.router-link-active {
        @apply bg-gray-100 text-black;
          .drop {
            @apply block opacity-75;
        }
      }

      .drop {
        @apply absolute right-4 hidden text-red-500 text-sm font-bold;
      }
    }
  }

  .select-document {
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
