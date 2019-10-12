<template>
  <p class="greet">{{ greeting }} World!</p>
</template>

<script>
module.exports = {
  data() {
    return { greeting: 'Hello' }
  }
}
</script>

<style lang="scss">
@import '~/assets/sass/index.scss';
.greet {
  color: $pink;
}
</style>
