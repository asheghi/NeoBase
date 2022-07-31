<template>
  <div class="LoginPage">
    <div class="cover">
      <div class="header">
        <Logo class="logo" width="180" height="180" />
        <h1 class="text-2xl text-center opacity-60">
          <span class="">Login to</span>
          NeoBase
        </h1>
      </div>

      <div class="form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            :disabled="loading"
            name="email"
            placeholder="john@doe.com"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            :disabled="loading"
            type="password"
            placeholder="secure password"
          />
        </div>
        <NButton
          :loading="loading"
          class="primary mt-4 w-full justify-between font-bold"
          @click="submit"
        >
          {{ loading ? "Signing in" : "Sign in" }}
        </NButton>
      </div>

      <div class="msg opacity-75">
        <p>
          New here?
          <router-link
            class="text-blue-700 dark:text-primary-200 font-bold"
            to="/register"
            >Register Here</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from "../../components/Logo.vue";
import { Api } from "../../lib/api";
import { setAccountToken } from "../../lib/auth";
import NButton from "../../components/design-system/N-Button.vue";

export default {
  name: "LoginPage",
  components: { NButton, Logo },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      loading: false,
    };
  },
  methods: {
    async submit() {
      try {
        this.loading = true;
        const { data } = await Api.login(this.form);
        setAccountToken(data.token);
        await this.$router.replace("/dash");
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
.LoginPage {
  @apply min-h-screen flex justify-center items-center;
  .cover {
    @apply flex flex-col justify-center items-center gap-7;
    .header {
      @apply flex justify-center flex-col gap-4 items-center py-4;
    }

    .form-group {
      @apply flex flex-col justify-start gap-2 mt-4;
      label {
        @apply min-w-[80px] opacity-75;
      }

      input {
        @apply px-4 py-2  bg-gray-100 dark:bg-gray-500 text-white dark:placeholder-gray-200
        outline-blue-600;
      }
    }
  }
}
</style>
