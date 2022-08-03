<template>
  <router-link v-if="to" :to="to" class="NButton" :class="$attrs.class">
    <slot />
  </router-link>
  <a v-if="href" :href="href" class="NButton" :class="$attrs.class">
    <slot />
  </a>
  <button
    v-else
    class="NButton"
    :disabled="loading || disabled"
    :class="extraClasses"
    @click="$attrs.onClick"
  >
    <slot />
    <IconLoading v-if="loading" width="24" height="24" class="icon-loading" />
  </button>
</template>
<script>
import IconLoading from "@mdi/svg/svg/loading.svg";
export default {
  name: "NButton",
  components: { IconLoading },
  props: {
    to: {
      default: null,
      required: false,
    },
    href: {
      default: null,
      required: false,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  computed: {
    extraClasses() {
      let it = "";
      it += this.$attrs.class;
      if (this.loading) it += " loading disabled";
      if (this.disabled) it += " disabled";
      return it;
    },
  },
};
</script>
<style lang="scss">
.NButton {
  @apply outline-0 px-4 flex gap-2 items-center justify-center  py-2 relative transition-all
    transition transform border border-transparent;
  &.primary {
    @apply transition-all bg-primary text-white fill-white;
    &:focus {
      @apply bg-blue-800 border-blue-400;
    }
    &:active {
      @apply bg-blue-800 bg-blue-800;
    }
    &.disabled {
      @apply bg-primary-600;
    }
  }
  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }
  .icon-loading {
    @apply fill-white;
    animation: spin 0.75s linear infinite;
  }

  &.disabled {
  }

  &.loading {
    @apply cursor-wait;
  }

  &.square {
    @apply px-2 py-2;
  }

  &:active {
    @apply bg-gray-200 dark:bg-gray-400;
  }

  &:focus {
    @apply border border-gray-500;
  }
  &.icon {
    @apply p-0;
  }

  &.primary-text {
    @apply font-bold text-primary fill-primary;
    .icon-loading {
      @apply fill-primary;
    }
    .disabled {
      @apply text-opacity-75;
    }
  }
  &.success {
    @apply bg-green-500 text-white;
  }
  &.secondary {
    @apply bg-gray-200 dark:bg-gray-600;
  }
}
</style>
