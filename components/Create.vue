<template>
  <div v-if="access[accessName + '.create']" :id="`parent-card-${accessName}`" class="mb-4">
    <b-btn
      class="mb-4"
      variant="primary"
      v-b-toggle="accessName + '-collapse'"
      @click="clicked = !clicked"
    >
      <fa class="side-icon" :class="clicked ? 'rotate-180' : ''" icon="chevron-down" />&nbsp;Create
    </b-btn>

    <b-collapse :id="accessName + '-collapse'">
      <slot></slot>
    </b-collapse>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    props: {
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
