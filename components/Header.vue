<template>
  <div class="header">
    <div class="menu">
      <nuxt-link to="/">TOP</nuxt-link>
    </div>
    <div class="menu">
      <nuxt-link to="uielements">UI</nuxt-link>
    </div>
    <div class="menu">
      <nuxt-link to="posts">UI</nuxt-link>
    </div>
  </div>
</template>

<style lang="scss">
@import '~/assets/sass/index.scss';
.header {
  padding: 20px;
  width: 100vw;
  display: flex;
  justify-content: center;
  border-bottom: solid 1px $grey-light;

  .menu {
    margin: 0 20px;
    padding: 5px 25px;
    background: $purple;
    border-radius: 5px;
    display: flex;
    align-items: center;
  }
}
</style>
