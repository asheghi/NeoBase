<template>
  <Modal ref="modal" :close-on-click-outside="!loading" :show-close="!loading">
    <div class="NewCollection">
      <div class="" @keydown.enter="submit">
        <label class="block mb-2" for="email">Collection Name</label>
        <input
          id="email"
          v-model="form.name"
          name="email"
          placeholder="Choose a plural name"
        />
        <div class="flex justify-end w-full">
          <NButton :loading="loading" class="primary mt-4" @click="submit">
            {{ loading ? "Creating" : "Create" }}
          </NButton>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "../../../../../components/Modal.vue";
import { Api } from "../../../../../lib/api.js";
import { toast } from "../../../../../plugins/alert.js";
import NButton from "../../../../../components/design-system/N-Button.vue";
export default {
  name: "NewCollectionModal",
  components: { NButton, Modal },
  props: {
    project: {
      type: String,
      required: true,
    },
  },
  emits: ["created"],
  data() {
    return {
      form: {},
      loading: false,
    };
  },
  methods: {
    show() {
      this.$refs.modal.show();
    },
    async submit() {
      this.loading = true;
      try {
        await Api.Collections(this.project).create({
          name: this.form.name,
        });
        toast("Created new Collection");
        this.$emit("created");
        this.$refs.modal.hide();
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.NewCollection {
  input {
    @apply border border-gray-200 px-2 py-1 outline-primary;
  }
}
</style>
