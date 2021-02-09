<template>
  <vue-showdown :markdown="content" :extension="['result']" />
</template>

<script lang="ts">
import Vue from 'vue'

// require('~/plugins/showdown')

export default Vue.extend({
    props: {
        content: {
            type: String,
            default: '',
        },
    },
})
</script>
