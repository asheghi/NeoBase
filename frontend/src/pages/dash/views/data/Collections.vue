<template>
  <div class="FireStore">
    <div class="card side-bar">
      <div class="header">Collections</div>
      <button class="btn btn-text btn-sm" @click="showNewCollectionModal">
        New Collection
      </button>
      <div class="items">
        <template v-if="!fetching">
          <router-link
            v-for="col in collections"
            :key="col"
            :to="{ name: 'documents', params: { collection: col.name } }"
            class="item name"
            :class="{ selected: col.name === collection }"
          >
            {{ col.name }}
            <div class="drop" @click="removeCollection(col)">
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
    <div v-if="collection" class="document w-full h-full relative">
      <transition name="fade">
        <router-view :key="collection" />
      </transition>
    </div>
    <div v-if="!collection" class="select-document">
      <div v-if="collections && collections.length">Select a Collection</div>
    </div>
    <Modal ref="modal">
      <div class="new-project">
        <div class="form" @keydown.enter="submit">
          <div class="form-group">
            <label for="email">Collection Name</label>
            <input
              id="email"
              v-model="form.name"
              name="email"
              placeholder="Choose a plural name"
            />
          </div>
          <button class="btn" @click="submit">Create</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "../../../../components/Modal.vue";
import { Api } from "../../../../lib/api";
import DeleteIcon from "ionicons/dist/svg/trash.svg";
import CreateIcon from "ionicons/dist/svg/pencil.svg";
import NButton from "../../../../components/design-system/N-Button.vue";
import swal from "sweetalert2";
import { toast } from "../../../../plugins/alert.js";

export default {
  name: "Collections",
  components: { NButton, Modal, DeleteIcon, CreateIcon },
  data() {
    return {
      form: {
        name: "",
      },
      collections: [],
      fetching: false,
    };
  },
  computed: {
    project() {
      return this.$route.params.project;
    },
    collection() {
      return this.$route.params.collection;
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    showNewCollectionModal() {
      this.$refs.modal.show();
    },
    async submit() {
      const { data, status } = await Api.Collections(this.project).create({
        name: this.form.name,
      });
      this.$refs.modal.hide();
      this.form.name = "";
      await this.fetchData();
    },
    async fetchData() {
      this.fetching = true;
      try {
        const { data } = await Api.Collections(this.project).list();
        this.collections = data;
      } catch (e) {
        console.error(e);
      } finally {
        this.fetching = false;
      }
    },
    async removeCollection(p) {
      const { isConfirmed } = await swal.fire({
        title: "Drop Collection " + p.name,
        html: "Are you sure? <br/> collection will be dropped and all document will be lost.",
        cancelButtonText: "cancel",
        customClass: { confirmButton: "danger", cancelButton: "secondary" },
        confirmButtonText: "Yes, Drop it",
        showCancelButton: true,
        preConfirm: async (confirmed) => {
          if (confirmed) {
            swal.showLoading(swal.getConfirmButton());
            try {
              await Api.Collections(this.project).delete(p.name);
              toast("Deleted Collection " + p.name);
              await this.fetchData();
              swal.close();
            } catch (e) {
              console.error(e);
            }
            return false;
          }
          return false;
        },
      });
    },
  },
};
</script>

<style lang="scss">
.FireStore {
  @apply flex flex-col md:flex-row gap-4;
  .side-bar {
    min-width: 240px;
    @apply flex flex-col gap-2 items-start p-0;
    .btn {
      @apply flex items-center justify-between gap-1 w-full px-4;
    }
    .items {
      @apply w-full flex flex-col gap-2;
    }

    .item {
      @apply relative flex items-center transition-all ease-linear w-full text-gray-600 px-4 py-2 dark:text-white;
      &.router-link-active {
        @apply bg-gray-100 text-black dark:text-white dark:bg-gray-500;
        &:hover {
          .drop {
            @apply block opacity-75;
          }
        }
      }

      .drop {
        @apply absolute right-4 hidden text-red-500 text-sm font-bold;
      }
    }
  }

  .select-document {
    @apply w-full flex justify-center items-center;
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
          @apply px-4 w-full py-2 bg-gray-100 outline-blue-500;
        }
      }

      .btn {
        @apply bg-blue-500 text-white px-4 py-2  mt-auto m-0;
      }
    }
  }
  .document {
  }
}
</style>
