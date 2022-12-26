<template>
  <div class="NewUser">
    <div class="form" @keydown.enter="submit">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          name="email"
          type="email"
          :disabled="loading"
          placeholder="enter your email address"
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="form.password"
          name="password"
          type="password"
          :disabled="loading"
          placeholder="enter a secure password"
        />
      </div>
      <div class="form-group">
        <label for="role">Role:</label>
        <input
          id="role"
          v-model="form.role"
          name="role"
          type="text"
          :disabled="loading"
          placeholder="enter a user role"
        />
      </div>
      <NButton :loading="loading" class="primary" @click="submit">
        Submit
      </NButton>
    </div>
  </div>
</template>
<script>
import { useRoute } from "vue-router";
import { Api } from "../../../../lib/api";
import NButton from "../../../../components/design-system/N-Button.vue";

export default {
  name: "NewUser",
  components: { NButton },
  emits: ["created"],
  setup() {
    let route = useRoute();
    const project = route.params.project;
    const api = Api.Users(project);
    return {
      api,
      project,
    };
  },
  data() {
    return {
      form: {},
      loading: false,
    };
  },
  methods: {
    async submit() {
      if (this.loading) return;
      this.loading = true;
      try {
        const payload = this.form;
        const { data, status } = await this.api.newUser(payload);
        this.$emit("created", data);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
<style lang="scss">
.NewUser {
  @apply flex flex-col gap-4;
  min-width: 260px;

  .form {
    @apply flex flex-col items-center gap-4 w-full;
    .form-group {
      @apply flex flex-col gap-2 w-full;
      label {
        @apply text-sm opacity-50;
      }

      input {
        @apply px-4 w-full py-2 outline-blue-500;
      }
    }

    .btn {
      @apply bg-blue-500 text-white px-4 py-2  mt-auto w-full m-0;
    }
  }
}
</style>
