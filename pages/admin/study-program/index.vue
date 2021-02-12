<template>
  <card access-name="study-program">
    <data-table type="study-program" :table="table" :edit="edit" />
  </card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    data: () => ({
        table: {
            fields: [{ key: 'title', sortable: true }, { key: 'action' }],
            items: [],
            busy: true,
        },
    }),
    async fetch() {
        if (this.access['study-program.show'])
            await this.$axios.get('/admin/study-program').then((r) => {
                this.table.items = r.data
                this.table.busy = false
            })
        else this.$router.push('/404')
    },
    methods: {
        edit(type: string, key: any) {
            this.$store.dispatch('setStudy', key)
            this.$router.push('/admin/study-program/' + key.slug)
        },
    },
    computed: {
        ...mapGetters(['access']),
    },
})
</script>
