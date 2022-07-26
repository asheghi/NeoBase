<template>
  <Modal
    ref="modal"
    :close-on-click-outside="!loading"
    @closed="form.name = ''"
  >
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
        <NButton :loading="loading" class="primary w-full" @click="submit">
          {{ loading ? "Creating new" : "Create" }} project
        </NButton>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "../../../../components/Modal.vue";
import NButton from "../../../../components/design-system/N-Button.vue";
import { Api } from "../../../../lib/api.js";
import { toast } from "../../../../plugins/alert.js";
export default {
  name: "NewProjectModal",
  components: { Modal, NButton },
  data() {
    return {
      form: {
        name: "",
      },
      loading: false,
    };
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    async submit() {
      if (this.loading) return;
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
  },
};
</script>

<style scoped></style>
