<template>
  <IconServer class="application-logo" :class="$attrs.class" />
</template>
<script setup>
import IconServer from "../assets/logo.svg";
</script>
<script>
export default {
  name: "AppLogo",
};
</script>

<style lang="scss">
.application-logo {
  @apply py-3 w-full rounded-2xl;
  path {
    &:nth-child(1) {
      @apply fill-primary-200;
    }
    &:nth-child(2) {
      @apply fill-primary-300;
    }
    &:nth-child(3) {
      @apply fill-primary-400;
    }
    &:nth-child(4) {
      @apply fill-primary-400;
    }
  }
}
</style>
