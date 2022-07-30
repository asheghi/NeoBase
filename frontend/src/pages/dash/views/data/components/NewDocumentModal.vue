<template>
  <Modal ref="modal">
    <div class="new-document">
      <CreateDocument
        ref="create"
        @created="onCreated"
        @cancel="$refs.modal.hide()"
      />
    </div>
  </Modal>
</template>

<script>
import CreateDocument from "./NewDocument.vue";
import Modal from "../../../../../components/Modal.vue";
export default {
  name: "NewDocumentModal",
  components: { Modal, CreateDocument },
  emits: ["created"],
  methods: {
    show() {
      this.$refs.modal.show();
    },
    onCreated(arg) {
      this.$refs.modal.hide();
      this.$emit("created", arg);
    },
  },
};
</script>

<style scoped></style>
