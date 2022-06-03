<template>
  <div class="ManageProjects">
    <div class="head">
      <h1 class="header-text">Projects</h1>
    </div>
    <div class="list">
      <div class="item">
        <button class="btn" @click="onNewProject">New Project</button>
      </div>
      <div v-for="p in projects" :key="p._id" class="item">
        <router-link
          :to="{ name: 'collections', params: { project: p.name } }"
          class="name"
        >
          {{ p.name }}
        </router-link>
        <button class="btn btn-danger" @click="removeProject(p)">Drop</button>
      </div>
      <div v-if="!projects || !projects.length" class="no-data">
        you have no projects.
      </div>
    </div>
    <Modal ref="modal" @onClose="form.name = ''">
      <div class="new-project">
        <div class="form" @keydown.enter="submit">
          <div class="form-group">
            <label for="email">Project Name</label>
            <input
              id="email"
              v-model="form.name"
              name="email"
              placeholder="what's the name of your app?"
            />
          </div>
          <button class="btn" @click="submit">Submit</button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "../../../components/Modal.vue";
import { Api } from "../../../lib/api";
import { toast } from "../../../plugins/alert";
import swal from "sweetalert2";

export default {
  name: "ManageProjects",
  components: { Modal },
  data() {
    return {
      form: {
        name: "",
      },
      projects: [],
      loading: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    onNewProject() {
      this.$refs.modal.show();
    },
    async submit() {
      if (this.loading) {
        console.log("already running");
        return;
      }
      this.loading = true;
      try {
        const { data, status } = await Api.Projects.create({
          name: this.form.name,
        });
        this.$refs.modal.hide();
        this.form.name = "";
        await this.fetchData();
        toast("New project created");
      } catch (e) {
        console.error(e);
        toast("Failed to create project", {
          text: e.response.data.msg,
          icon: "error",
        });
      } finally {
        this.loading = false;
      }
    },
    async fetchData() {
      const { data } = await Api.Projects.list();
      this.projects = data;
    },
    async removeProject(p) {
      try {
        const result = await swal.fire({
          title: "Delete Project",
          icon: "warning",
          text: `Are you sure? project "${p.name}" will be wiped out!`,
          showCancelButton: true,
          confirmButtonText: "yes, delete project",
          confirmButtonColor: "red",
          customClass: {
            cancelButton: "bg-green-500 text-white",
          },
        });
        if (!result.isConfirmed) {
          return;
        }
        const { data } = await Api.Projects.delete(p.name);
        await this.fetchData();
        toast(`Deleted Project "${p.name}"`);
      } catch (e) {
        console.error(e);
        toast("Failed to delete project", {
          text: e.response.data.msg,
          icon: "warning",
        });
      } finally {
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
    @apply mt-4;
    .item {
      @apply py-2 flex items-center gap-16 items-center;
      a {
        min-width: 120px;
      }

      .btn {
        @apply text-blue-400 px-4 -mx-4 py-2
        font-bold text-sm;
      }

      .btn-danger {
        @apply -mx-4 px-4 text-red-500 font-bold;
      }
    }
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
