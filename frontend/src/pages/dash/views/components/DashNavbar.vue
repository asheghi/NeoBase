<template>
  <nav class="DashNavBar">
    <NButton class="gap-2 px-0 hidden lg:flex mr-4">
      <IconLogo />
      NeoBase
    </NButton>
    <NButton class="lg:hidden square" @click="expanded = !expanded">
      <IconMenu />
    </NButton>
    <div class="title" v-text="title"></div>

    <NButton class="square ml-auto" @click="toggleDarkMode">
      <component
        :is="isDarkMode ? IconLightMode : IconDarkMode"
        class="toggle"
        width="28"
        height="28"
      />
    </NButton>
    <NButton class="square">
      <IconNotifications />
    </NButton>
    <NButton class="square">
      <IconAccount />
    </NButton>
    <div class="nav-drawer" :class="{ expanded, 'hide-nav': !project }">
      <NButton class="flex lg:hidden gap-2 px-0">
        <IconLogo />
        NeoBase
      </NButton>
    </div>
    <transition name="fade">
      <div
        v-if="expanded"
        class="nav-drawer-shadow"
        @click="expanded = false"
      ></div>
    </transition>
  </nav>
</template>
<script setup>
import IconDarkMode from "ionicons/dist/svg/moon-sharp.svg";
import IconLightMode from "ionicons/dist/svg/sunny.svg";
import { isDarkMode, toggleDarkMode } from "../../../../lib/theme";
</script>
<script>
import IconMenu from "@mdi/svg/svg/menu.svg";
import IconNotifications from "@mdi/svg/svg/bell.svg";
import IconAccount from "@mdi/svg/svg/account.svg";
import NButton from "../../../../components/design-system/N-Button.vue";
import IconLogo from "../../../../assets/logo-color.svg";
export default {
  name: "DashNavBar",
  components: {
    NButton,
    IconMenu,
    IconNotifications,
    IconAccount,
    IconLogo,
  },
  data() {
    return {
      expanded: false,
    };
  },
  computed: {
    title() {
      return this.$route.name;
    },
    project() {
      return this.$route.params.project;
    },
  },
};
</script>
<style lang="scss">
.DashNavBar {
  @apply fixed inset-x-0 top-0 flex px-2 py-2 items-center justify-between
  bg-white border-b border-gray-300 dark:border-gray-500 z-10;
  height: var(--nav-height);
  transition: all linear 240ms;

  @apply fill-primary-700;
  svg {
    path {
      width: 24px !important;
      height: 24px !important;
    }
  }

  .nav-drawer {
    @apply fixed bg-white inset-y-0 z-50 py-4 px-2;
    width: var(--side-width);
    transition: all ease 350ms;
    left: -100%;
    &.expanded {
      @apply left-0;
    }
    @screen lg {
      @apply left-0 border-r border-gray-300 dark:border-gray-500;
      top: var(--nav-height);
    }
    &.hide-nav {
      @apply hidden;
    }
  }
  .nav-drawer-shadow {
    @apply bg-black opacity-25 fixed inset-0 z-0;
  }
  .title {
    @apply capitalize;
  }
}
.dark {
  .DashNavBar {
    @apply bg-gray-600 fill-white;
    .nav-drawer {
      @apply bg-gray-500;
    }
  }
}
</style>
