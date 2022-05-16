<template>
  <div class="ManageProjects">
    <div class="head">
      <h1 class="header-text">Projects</h1>
      <button class="btn" @click="onNewProject">
        New Project
      </button>
    </div>
    <div class="list">
      <div class="item" v-for="p in projects" :key="p._id">
        <div class="name" v-text="p.name"></div>
        <button @click="removeProject(p)" class="btn btn-danger">
          Delete
        </button>
      </div>
      <div class="no-data" v-if="!projects || !projects.length">
        you have no projects.
      </div>
    </div>
    <Modal ref="modal">
      <div class="new-project">
        <div class="form" @keydown.enter="submit">
          <div class="form-group">
            <label for="email">Project Name</label>
            <input id="email" name="email" v-model="form.name"
                   placeholder="what's the name of your app?"
            >
          </div>
          <button @click="submit" class="btn">
            Submit
          </button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import Modal from "../../../components/Modal.vue";
import {ax} from "../../../plugins/axios";

export default {
  name: "ManageProjects",
  components: {Modal},
  mounted() {
    this.fetchData();
  },
  methods: {
    onNewProject() {
      this.$refs.modal.show();
    },
    async submit() {
      const {data, status} = await ax.post('projects', {name: this.form.name})
      this.$refs.modal.hide()
      this.form.name = '';
      await this.fetchData();
    },
    async fetchData() {
      const {data} = await ax.get('projects');
      this.projects = data;
    },
    async removeProject(p) {
      const {data} = await ax.delete('projects/' + p.name);
      await this.fetchData();
    }
  },
  data() {
    return {
      form: {
        name: '',
      },
      projects: [],
    }
  }
}
</script>

<style lang="scss">
.ManageProjects {
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
    .new-project {
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
