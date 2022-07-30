<template>
  <div class="ManageProjects">
    <div class="list">
      <button class="card" @click="onNewProject">
        <IconPlus viewBox="0 0 20 20" class="icon" />
        <span>New Project</span>
      </button>
      <template v-if="fetching">
        <div v-for="i in 3" :key="i" class="card skeloading"></div>
      </template>
      <template v-if="!fetching">
        <router-link
          v-for="p in projects"
          :key="p._id"
          :to="{ name: 'collections', params: { project: p.name } }"
          class="card"
        >
          <IconFolder class="icon" viewBox="0 0 24 24" />
          {{ p.name }}
        </router-link>
        <div v-if="!projects || !projects.length" class="no-data">
          you have no projects.
        </div>
      </template>
    </div>
    <NewProjectModal ref="newProjectModal" />
  </div>
</template>

<script>
import { Api } from "../../../lib/api";
import IconPlus from "@mdi/svg/svg/plus.svg";
import IconFolder from "@mdi/svg/svg/folder.svg";
import NewProjectModal from "./components/NewProjectModal.vue";

export default {
  name: "ManageProjects",
  components: { NewProjectModal, IconPlus, IconFolder },
  data() {
    return {
      projects: [],
      fetching: null,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    onNewProject() {
      this.$refs.newProjectModal.show();
    },
    async fetchData() {
      this.fetching = true;
      try {
        const { data } = await Api.Projects.list();
        this.projects = data;
      } catch (e) {
        console.error(e);
      } finally {
        this.fetching = false;
      }
    },
  },
};
</script>

<style lang="scss">
.ManageProjects {
  .head {
    @apply flex justify-between items-center;
    .header-text {
      @apply font-bold text-lg;
    }
  }

  .list {
    @apply mt-4 grid py-4 lg:grid-cols-4 grid-cols-1 sm:grid-cols-2
    md:grid-cols-3 gap-8 fill-primary-700;
    .card {
      @apply bg-white dark:bg-gray-600 transition transform
      p-8 flex flex-col gap-8 justify-center items-center rounded
      shadow;

      &:hover,
      &:focus {
        @apply outline-0 shadow-lg scale-105;
      }

      &:active {
        @apply scale-95 shadow bg-gray-300 dark:bg-gray-700;
      }
      .icon {
        @apply w-[54px] h-[54px] dark:fill-white fill-primary-400;
      }
    }
    .skeloading {
      @apply bg-gray-200;
    }
  }

  .modal-box {
    .new-project {
      @apply flex flex-col gap-4;
      min-width: 360px;
    }

    .form {
      @apply flex flex-col items-center gap-4 w-full;
      .form-group {
        @apply flex flex-col gap-2 w-full;
        label {
          @apply text-sm opacity-50;
        }

        input {
          @apply px-4 w-full py-2  bg-gray-100 outline-blue-500;
        }
      }

      .btn {
        @apply bg-blue-500 text-white px-4 py-2  mt-auto m-0;
      }
    }
  }
}
</style>
