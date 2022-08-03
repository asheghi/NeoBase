<template>
  <div class="Users">
    <div class="side-bar card" :class="{ showingUser: uid }">
      <div class="header">Users</div>
      <button
        class="px-4 text-primary dark:text-primary-300 font-bold py-2"
        @click="showNewUserModal"
      >
        New User
      </button>
      <div class="items">
        <template v-if="!fetching">
          <router-link
            v-for="user in users"
            :key="user"
            :to="{ name: 'user', params: { uid: user._id } }"
            class="item name"
          >
            {{ user.email }}
          </router-link>
        </template>
        <template v-if="fetching">
          <div class="item h-8 skeloading"></div>
          <div class="item h-8 skeloading"></div>
          <div class="item h-8 skeloading"></div>
        </template>
      </div>
    </div>
    <div v-if="uid" class="card user-info">
      <transition name="fade">
        <router-view :key="uid" @delete="deleteUser($event)" />
      </transition>
    </div>
    <Modal ref="modal">
      <NewUser @created="onCreated" />
    </Modal>
  </div>
</template>
<script>
import { useRoute } from "vue-router";
import { Api } from "../../../../lib/api";
import DeleteIcon from "ionicons/dist/svg/trash.svg";
import NewUser from "./NewUser.vue";
import Modal from "../../../../components/Modal.vue";
import { computed } from "vue";
import swal from "sweetalert2";
import { toast } from "../../../../plugins/alert.js";

export default {
  name: "Users",
  components: { Modal, NewUser, DeleteIcon },
  setup() {
    const route = useRoute();
    const uid = computed(() => route.params.uid);
    return {
      uid,
    };
  },
  data() {
    return {
      users: [],
      fetching: false,
    };
  },
  computed: {
    api() {
      return Api.Users(this.$route.params.project);
    },
  },
  watch: {
    "$route.params.project": {
      handler(n, o) {
        if (n) this.fetchData();
      },
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      this.fetching = true;
      try {
        const { data } = await this.api.find();
        this.users = data;
      } catch (e) {
        console.error(e);
      } finally {
        this.fetching = false;
      }
    },
    showNewUserModal() {
      this.$refs.modal.show();
    },
    async deleteUser(user) {
      await swal.fire({
        title: "Delete User",
        html: "Are you sure?",
        cancelButtonText: "cancel",
        customClass: { confirmButton: "danger", cancelButton: "secondary" },
        confirmButtonText: "Yes, Delete it",
        showCancelButton: true,
        preConfirm: async (confirmed) => {
          if (confirmed) {
            swal.showLoading(swal.getConfirmButton());
            try {
              await this.api.deleteUser(user);
              await this.fetchData();
              await this.$router.replace({ name: "auth" });
              toast("Deleted User");
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
    async onCreated(user) {
      this.$refs.modal.hide();
      await this.fetchData();
      await this.$router.push({ name: "user", params: { uid: user._id } });
    },
  },
};
</script>
<style lang="scss">
.Users {
  @apply flex gap-4 w-full h-full;
  .side-bar {
    min-width: 240px;
    @apply flex flex-col gap-2 items-start;
    .items {
      @apply w-full flex flex-col gap-2;
    }

    .item {
      @apply relative pr-12 flex items-center transition-all ease-linear w-full dark:text-white text-gray-600 pl-4 py-2;
      &.router-link-active {
        @apply bg-gray-100 text-black dark:text-white dark:bg-gray-500;
        &:hover {
          .drop {
            @apply block opacity-75;
          }
        }
      }
    }
    &.showingUser {
      @apply hidden xl:flex;
    }
  }
  .user-info {
    @apply relative;
  }
}
</style>
