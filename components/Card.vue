<template>
  <b-card v-if="access[accessName + '.show']" class="my-4">
    <b-card-title v-if="hData">
      <b-btn
        v-if="access[accessName + '.update']"
        variant="info"
        title="Edit"
        v-b-tooltip.hover
        size="sm"
        @click="edit()"
      >
        <fa icon="pencil-alt" />
      </b-btn>
      &nbsp;{{ title }}
    </b-card-title>
    <b-card-title v-else-if="title">{{ title }}</b-card-title>
    <slot></slot>
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
        hData: {
            type: Object,
            default: null,
        },
    },
    methods: {
        edit() {
            this.$emit('h-edit', 'section', this.hData)
        },
    },
    computed: {
        ...mapGetters(['access']),
    },
})
</script>
