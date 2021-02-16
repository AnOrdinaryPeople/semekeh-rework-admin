<template>
  <b-row>
    <b-col class="text-center" cols="2">
      <fa :icon="icon" />
    </b-col>
    <b-col cols="10">
      <slot />
    </b-col>
  </b-row>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        icon: {
            type: String,
            required: true,
        },
    },
})
</script>
