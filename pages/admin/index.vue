<template>
  <div>
    <b-btn @click="logout()">logout</b-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    methods: {
        logout() {
            localStorage.removeItem('app')
            this.$auth.logout()
        },
    },
})
</script>
