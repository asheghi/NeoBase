<template>
  <div class="Modal">
    <transition name="fade">
      <div
        v-if="open"
        class="modal-fullscreen"
        @click.stop.prevent="outSideClicked"
      >
        <div class="modal-box" @click.stop>
          <slot />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    closeOnClickOutside: {
      type: Boolean,
      default: true,
      required: false,
    },
    showClose: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  emits: ["closed"],
  data() {
    return {
      open: false,
    };
  },
  methods: {
    show() {
      this.open = true;
      setTimeout(() => {
        const input = document.querySelector(".Modal input");
        if (input) {
          input.focus();
        }
      }, 360);
    },

    outSideClicked() {
      if (!this.closeOnClickOutside) return;
      this.hide();
    },
    hide() {
      this.open = false;
      this.$emit("closed");
    },
  },
};
</script>

<style lang="scss">
.Modal {
  transition: all ease 360ms;

  .modal-fullscreen {
    @apply fixed inset-0 w-full h-screen overflow-hidden;
    z-index: 9;
    @apply w-full h-full flex justify-center items-center;
    background: rgba(black, 0.1);
    backdrop-filter: blur(1px);

    .modal-box {
      .close-icon {
        @apply absolute top-1 right-1 cursor-pointer;
      }
      @apply relative bg-white dark:bg-gray-600 dark:text-white px-4 py-6   shadow-xl;
      max-height: 90vh;
      overflow-y: auto;
      max-width: 92vw;
      @apply text-xs sm:text-base;
    }
  }
}
</style>
