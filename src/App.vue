<template>
  <div class="container">
    <SignUpPage />
    <LanguageSelector />
  </div>
</template>

<script>
import SignUpPage from './pages/SignUpPage.vue';
import LanguageSelector from './components/LanguageSelector.vue';

export default {
  name: 'App',
  components: {
    SignUpPage,
    LanguageSelector,
    LanguageSelector
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
