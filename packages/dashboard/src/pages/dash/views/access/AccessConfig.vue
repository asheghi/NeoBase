<template>
  <div class="AccessConfig">
    <div class="card mb-4">
      <div class="flex header">
        Access Config
        <span class="pl-2 normal-case">
          {{ collection }}
        </span>
        <span class="ml-auto"></span>
        <NButton class="" @click="resetConfig">
          <IconReset />
        </NButton>
      </div>
    </div>
    <ConfigEditor
      v-if="!fetching"
      :key="render_counter"
      :config="accessConfig"
      :loading="loading"
      @save="updateConfig"
    />
    <div v-if="fetching" class="skeloading"></div>
  </div>
</template>

<script>
import { Api } from "../../../../lib/api";
import ConfigEditor from "./components/ConfigEditor.vue";
import swal from "sweetalert2";
import IconReset from "@mdi/svg/svg/lock-reset.svg";
import NButton from "../../../../components/design-system/N-Button.vue";
import { toast } from "../../../../plugins/alert.js";

export default {
  name: "AccessConfig",
  components: { NButton, ConfigEditor, IconReset },
  beforeRouteUpdate() {
    this.fetchData();
  },
  data() {
    return {
      accessConfig: null,
      render_counter: 1,
      loading: false,
      fetching: false,
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
  watch: {
    "$route.params.project": {
      handler(n, o) {
        if (n) this.$router.push({ name: "access", params: { project: n } });
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
        const { data } = await this.api.getAccessConfig(this.collection);
        this.accessConfig = data;
      } catch (e) {
        console.error(e);
      } finally {
        this.fetching = false;
      }
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
        preConfirm: async (inputValue) => {
          if (!inputValue) return inputValue;
          swal.showLoading(swal.getConfirmButton());
          try {
            await this.api.resetConfig(this.collection);
            await this.fetchData();
            this.render_counter++;
            swal.close();
            toast("Config has been reset");
          } catch (e) {
            console.error(e);
          } finally {
            swal.hideLoading();
          }
        },
      });
      if (!isConfirmed) return;
    },
    async updateConfig(config) {
      try {
        this.loading = true;
        await this.api.updateConfig(this.collection, config);
        // await this.fetchData();
        this.render_counter++;
        toast("Saved Changes");
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
.AccessConfig {
  @apply absolute inset-0 px-4;
  .skeloading {
    @apply w-full min-h-[400px];
  }
}
</style>
