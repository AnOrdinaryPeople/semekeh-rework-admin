<template>
  <div class="__nuxt-error-page mt-5 pt-3">
    <div class="error">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="90"
        height="90"
        fill="#022c43"
        viewBox="0 0 48 48"
      >
        <path
          d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"
        />
      </svg>
      <div class="title">{{ error.message }}</div>
      <p class="description">
        <a href="/" class="error-link nuxt-link-active">Back to the home page</a>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.__nuxt-error-page {
    padding: 1rem;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    .error {
        max-width: 100vh;
    }

    .title {
        font-size: 1.5rem;
        margin-top: 15px;
        margin-bottom: 8px;
    }

    .description {
        color: #7f828b;
        line-height: 21px;
        margin-bottom: 10px;
    }

    a {
        color: #7f828b !important;
        text-decoration: none;
    }
}
</style>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: ['error'],
    layout: 'error',
})
</script>
