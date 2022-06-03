<template>
  <div class="AccessConfig">
    <div class="flex">
      <div class="header">Access Config of {{ collection }}</div>
      <div class="actions ml-auto flex gap-4">
        <button class="text-red-400" @click="resetConfig">Reset</button>
        <button @click="toggleEditMode">Edit</button>
      </div>
    </div>
    <br />
    <pre
      v-if="mode === 'view'"
    ><code>{{ JSON.stringify(accessConfig,null,'\t') }}</code></pre>
    <ConfigEditor
      v-if="mode === 'edit'"
      :config="accessConfig"
      @saved="onConfigChange"
      @canceled="onEditorCanceled"
    />
  </div>
</template>

<script>
import { Api } from "../../../../lib/api";
import ConfigEditor from "./components/ConfigEditor.vue";
import swal from "sweetalert2";

export default {
  name: "AccessConfig",
  components: { ConfigEditor },
  beforeRouteUpdate() {
    this.fetchData();
  },
  data() {
    return {
      accessConfig: {},
      mode: "view",
    };
  },
  computed: {
    api() {
      return Api.AccessControl(this.project);
    },
    collection() {
      return this.$route.params.collection;
    },
    project() {
      return this.$route.params.project;
    },
    alternateMode() {
      if (this.mode === "edit") return "view";
      return "edit";
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      const { data } = await this.api.getAccessConfig(this.collection);
      this.accessConfig = data;
    },
    toggleEditMode() {
      this.mode = this.alternateMode;
    },
    async onConfigChange(config) {
      await this.api.updateConfig(this.collection, config);
      this.toggleEditMode();
      this.fetchData();
    },
    onEditorCanceled() {
      this.mode = "view";
    },
    async resetConfig() {
      const { isConfirmed } = await swal.fire({
        title: "Reset Config",
        text: "Are you sure?",
        cancelButtonText: "cancel",
        cancelButtonColor: "gray",
        confirmButtonText: "Yes, reset config",
        confirmButtonColor: "red",
        showCancelButton: true,
      });
      if (!isConfirmed) return;
      await this.api.resetConfig(this.collection);
      this.fetchData();
    },
  },
};
</script>

<style lang="scss">
.AccessConfig {
  @apply absolute inset-0;
}
</style>
