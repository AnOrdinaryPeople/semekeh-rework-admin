<template>
  <div v-if="access[accessName + '.create']" class="mb-4">
    <b-btn
      class="mb-4"
      variant="primary"
      v-b-toggle="type + '-collapse'"
      @click="clicked = !clicked"
    >
      <fa class="side-icon" :class="clicked ? 'rotate-180' : ''" icon="chevron-down" />&nbsp;Create
    </b-btn>

    <b-collapse :id="type + '-collapse'">
      <slot></slot>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    props: {
        type: {
            required: true,
            type: String,
        },
        accessName: {
            required: true,
            type: String,
        },
    },
    data: () => ({
        clicked: false,
    }),
    computed: {
        ...mapGetters(['access']),
    },
})
</script>
