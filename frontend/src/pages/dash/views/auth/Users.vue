<template>
  <div class="Users">
    <div class="side-bar">
      <div class="head">Users</div>
      <button class="btn btn-text btn-sm" @click="showNewUserModal">
        New User
      </button>
      <div class="items">
        <router-link
          v-for="user in users"
          :key="user"
          :to="{ name: 'user', params: { uid: user._id } }"
          class="item name"
        >
          {{ user.email }}
          <div class="drop" @click="deleteUser(user)">
            <DeleteIcon
              class="fill-red-500 opacity-75"
              width="24"
              height="24"
            />
          </div>
        </router-link>
      </div>
    </div>
    <div v-if="uid" class="document w-full h-full relative">
      <transition name="fade">
        <router-view :key="uid" />
      </transition>
    </div>
    <div v-if="!uid" class="select-document">
      <div v-if="users && users.length">select a user first</div>
      <div v-else class="">create a user first</div>
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

export default {
  name: "Users",
  components: { Modal, NewUser, DeleteIcon },
  setup() {
    const route = useRoute();
    const project = route.params.project;
    const uid = computed(() => route.params.uid);
    return {
      api: Api.Users(project),
      uid,
    };
  },
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const { data } = await this.api.find();
      this.users = data;
    },
    showNewUserModal() {
      this.$refs.modal.show();
    },
    async deleteUser(user) {
      const { data } = await this.api.deleteUser(user);
      await this.fetchData();
      await this.$router.replace({ name: "auth" });
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
  @apply flex gap-2;
  .side-bar {
    min-width: 240px;
    @apply flex flex-col gap-2 items-start;
    .head {
      @apply bg-gray-100 w-full flex gap-1 px-2 py-2 rounded;
      .icon {
        @apply fill-gray-500;
      }
    }
    .btn {
      @apply flex items-center justify-between gap-1 w-full;
    }
    .items {
      @apply w-full flex flex-col gap-2;
    }

    .item {
      @apply relative flex items-center transition-all ease-linear w-full rounded-lg text-gray-600 px-2 py-2;
      &.router-link-active {
        @apply bg-gray-100 text-black;
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
}
</style>
