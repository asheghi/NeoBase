<template>
  <div class="User">
    <div class="card">
      <div class="header flex items-center">
        User
        <span class="ml-auto"></span>
        <NButton v-if="user" @click="$emit('delete', user)">
          <DeleteIcon />
        </NButton>
      </div>
      <div v-if="!fetching" class="form">
        <div v-for="key in Object.keys(form)" :key="key" class="form-group">
          <label :for="key" v-text="key"></label>
          <input
            :id="key"
            v-model="form[key]"
            :disabled="loading"
            type="text"
          />
        </div>
        <div class="flex gap-2 justify-end">
          <NButton v-if="formChanged" class="text-gray-500" @click="resetForm">
            Reset Changes
          </NButton>
          <NButton
            :loading="loading"
            :disabled="!formChanged"
            class="primary"
            @click="updateUser"
          >
            {{ loading ? "Saving" : "Save" }}
          </NButton>
        </div>
      </div>
      <div v-if="fetching" class="skeloading"></div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { Api } from "../../../../lib/api";
import { computed, onMounted, reactive, ref } from "vue";
import NButton from "../../../../components/design-system/N-Button.vue";
import DeleteIcon from "@mdi/svg/svg/delete.svg";
import { toast } from "../../../../plugins/alert.js";

export default {
  name: "User",
  components: { NButton, DeleteIcon },
  beforeRouteUpdate() {
    this.fetchUser();
  },
  emits: ["delete"],
  setup() {
    const route = useRoute();
    const project = route.params.project;
    const api = Api.Users(project);
    const user = ref();
    const form = reactive({});
    const fetching = ref(false);
    const loading = ref(false);
    const fetchUser = async () => {
      fetching.value = true;
      let data = {};
      try {
        const uid = route.params.uid;
        const res = await api.fetchUser(uid);
        data = res.data;
        user.value = res.data;
      } catch (e) {
        console.error(e);
      } finally {
        fetching.value = false;
      }
      Object.keys(data)
        .filter(
          (it) => !["_id", "createdAt", "updatedAt", "createdBy"].includes(it)
        )
        .forEach((key) => {
          form[key] = data[key];
        });
      if (!("role" in form)) form.role = null;
    };
    const formChanged = computed(() => {
      return Object.keys(form).find((key) => user.value?.[key] != form[key]);
    });
    const updateUser = async () => {
      if (!formChanged.value) return;
      try {
        loading.value = true;
        await api.updateUser(user.value._id, form);
        await fetchUser();
        toast("Updated User");
      } catch (e) {
        console.error(e);
      } finally {
        loading.value = false;
      }
    };
    const resetForm = () => {
      Object.keys(form).forEach((key) => {
        form[key] = user.value[key];
      });
    };
    onMounted(() => {
      fetchUser();
    });
    return {
      project,
      api,
      fetchUser,
      user,
      form,
      formChanged,
      resetForm,
      fetching,
      updateUser,
      loading,
    };
  },
  watch: {
    "$route.params.project": {
      handler(n, o) {
        if (n) this.$router.push({ name: "auth", params: { project: n } });
      },
    },
  },
};
</script>

<style lang="scss">
.User {
  @apply p-0 min-w-[300px];
  .form {
    @apply p-4 flex flex-col gap-4;
    .form-group {
      @apply flex flex-col gap-2;
      label {
        @apply opacity-50 capitalize;
      }
      input {
        @apply px-2 py-1 border-gray-200 border outline-primary;
      }
    }
  }
  .skeloading {
    @apply w-full min-h-[200px];
  }
}
</style>
