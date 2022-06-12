<template>
  <div class="ConfigEditor">
    <div class="flex gap-4 items-center">
      <button
        class="text-white bg-blue-500 rounded px-20 py-1 mb-4"
        @click="addRole"
      >
        Add Role
      </button>
      <button
        v-if="configChanged"
        class="text-white bg-gray-500 rounded px-8 py-1 mb-4"
        @click="discardChanges"
      >
        discard changes
      </button>
      <button
        v-if="configChanged"
        class="ml-auto text-white bg-green-500 rounded px-2 py-1 mb-4"
        @click="saveChanges"
      >
        Save Changes
      </button>
    </div>
    <div
      v-for="(conf, index) in tempConfig"
      :key="index"
      class="config mb-4 border px-2 rounded py-4"
    >
      <div class="user w-full flex gap-2 items-center mb-2">
        <select
          :value="getUserMode(conf)"
          @change="onUserModeChanged(conf, $event)"
        >
          <option value="role">users with role</option>
          <option value="authed">authenticated users</option>
          <option value="un_authed">un-authenticated users</option>
        </select>
        <input
          v-if="getUserMode(conf) === 'role'"
          v-model="conf.user.role"
          type="text"
        />

        <button
          class="text-white ml-auto bg-red-400 px-2 py-1 rounded"
          @click="removeRole(index)"
        >
          Remove Role
        </button>
      </div>
      <div class="access flex flex-col justify-center space-y-2 px-4">
        <div class="create flex items-center gap-1 w-full">
          <input
            :id="'create_' + index"
            v-model="conf.create"
            name="create"
            type="checkbox"
            v-text="'can create'"
          />
          <label :for="'create_' + index">can create documents</label>
        </div>
        <div
          v-for="mode in ['read', 'update', 'delete']"
          :key="mode"
          :class="mode"
        >
          <select
            :value="getFilterMode(conf[mode])"
            class="w-full"
            @change="onFilterChanged(conf, mode, $event)"
          >
            <option value="all">can {{ mode }} all documents</option>
            <option value="own">can {{ mode }} documents created by him</option>
            <option value="custom">can {{ mode }} some documents</option>
            <option value="none">can't {{ mode }} any documents</option>
          </select>
          <JsonEditor
            v-if="getFilterMode(conf[mode]) === 'custom'"
            v-model="conf[mode]"
          />
        </div>
      </div>
      <br />
    </div>
  </div>
</template>
<script>
import JsonEditor from "../../data/components/JsonEditor.vue";
const filterOwn = {
  createdBy: "$uid",
};
import { ref } from "vue";
export default {
  name: "ConfigEditor",
  components: { JsonEditor },
  props: {
    config: {
      type: Object,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["saved", "canceled"],
  setup(props) {
    const tempConfig = ref(props.config);
    const initialConfig = JSON.parse(JSON.stringify(props.config));
    return { tempConfig, initialConfig };
  },
  computed: {
    hasUnAuthenticatedRole() {
      return this.tempConfig.find((it) => !it.user);
    },
    hasAuthenticatedRole() {
      return this.tempConfig.find((it) => it.user === true);
    },
    configChanged() {
      try {
        let temp = JSON.stringify(this.tempConfig);
        let init = JSON.stringify(this.initialConfig);
        console.log("check", temp, init);
        return temp !== init;
      } catch (e) {
        return true;
      }
    },
  },
  methods: {
    getUserMode(conf) {
      if (conf.user && conf.user.role !== undefined) return "role";
      if (conf.user === true) return "authed";
      return "un_authed";
    },
    removeRole(index) {
      this.tempConfig.splice(index, 1);
    },
    addRole() {
      if (!this.hasUnAuthenticatedRole) {
        this.tempConfig.splice(0, 0, {
          user: false,
          create: false,
          read: false,
          delete: false,
          update: false,
        });
      } else if (!this.hasAuthenticatedRole) {
        this.tempConfig.splice(0, 0, {
          user: true,
          create: false,
          read: false,
          delete: false,
          update: false,
        });
      } else {
        this.tempConfig.splice(0, 0, {
          user: {
            role: "",
          },
          create: false,
          read: false,
          delete: false,
          update: false,
        });
      }
    },
    getFilterMode(value) {
      if (!value) return "none";
      if (value === true) return "all";
      if (JSON.stringify(filterOwn) === JSON.stringify(value)) return "own";
      return "custom";
    },
    onUserModeChanged(conf, arg) {
      const which = arg.target.value;
      const mode = this.getUserMode(conf);
      if (mode === which) return;
      if (which === "role") {
        conf.user = {
          role: "",
        };
      } else conf.user = which === "authed";
    },
    onFilterChanged(conf, mode, event) {
      const before = conf[mode];
      const after = event.target.value;
      if (before === after) return;
      if (after === "none") {
        conf[mode] = false;
      } else if (after === "all") {
        conf[mode] = true;
      } else if (after === "own") {
        conf[mode] = filterOwn;
      } else {
        conf[mode] = {};
      }
    },
    discardChanges() {
      this.tempConfig.splice(0, this.tempConfig.length);
      this.tempConfig.push(...this.initialConfig);
    },
    saveChanges() {
      this.$emit("save", this.tempConfig);
    },
  },
};
</script>
<style lang="scss">
.ConfigEditor {
  input,
  select {
    @apply rounded bg-gray-200 border border-gray-200 px-2 py-1;
  }
  .access {
    max-width: 400px;
  }
}
</style>
