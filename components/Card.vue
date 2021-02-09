<template>
  <b-card v-if="access[accessName + '.show']" class="my-4">
    <b-card-body>
      <b-card-title v-if="title">{{ title }}</b-card-title>
      <slot></slot>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    props: {
        accessName: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            default: null,
        },
    },
    computed: {
        ...mapGetters(['access']),
    },
})
</script>
