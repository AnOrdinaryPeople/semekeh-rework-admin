<template>
  <vue-showdown :markdown="content" :extensions="['result']" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        content: {
            type: String,
            default: '',
        },
    },
})
</script>
