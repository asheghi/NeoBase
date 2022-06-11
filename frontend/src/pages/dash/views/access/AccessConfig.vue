<template>
  <div class="AccessConfig">
    <div class="flex">
      <div class="header">Access Config of {{ collection }}</div>
      <div class="actions ml-auto flex gap-4">
        <button class="text-red-400" @click="resetConfig">
          Reset to Default
        </button>
      </div>
    </div>
    <br />
    <ConfigEditor
      v-if="accessConfig"
      :key="render_counter"
      :config="accessConfig"
      @save="updateConfig"
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
      accessConfig: null,
      render_counter: 1,
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
      await this.fetchData();
      this.render_counter++;
    },
    async updateConfig(config) {
      await this.api.updateConfig(this.collection, config);
      await this.fetchData();
      this.render_counter++;
    },
  },
};
</script>

<style lang="scss">
.AccessConfig {
  @apply absolute inset-0 px-4;
}
</style>
