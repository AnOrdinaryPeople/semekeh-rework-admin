<template>
  <div>
    <card access-name="audits">
      <b-row v-if="!table.busy" class="mb-4">
        <b-col cols="6">
          <label>Start date</label>
          <b-form-datepicker v-model="a" />
        </b-col>
        <b-col cols="6">
          <label>End date</label>
          <b-form-datepicker :disabled="a === null" :min="new Date(a)" v-model="b" />
        </b-col>
      </b-row>

      <data-table type="audits" :table="data" :show="show" />
    </card>

    <b-modal id="show" title="Detail" hide-footer>
      <div class="mb-2" v-for="(i, k) in Object.keys(modal)" :key="k">
        <strong>{{ i.replace(/_/g, ' ') }}</strong>

        <div v-if="i === 'old_values' || i === 'new_values'">
          <pre>{{ JSON.stringify(JSON.parse(modal[i]), null, 2) }}</pre>
        </div>
        <div v-else-if="i === 'event'">
          <strong :class="warn(modal[i])">{{ modal[i] }}</strong>
        </div>
        <div v-else>{{ modal[i] }}</div>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    data: () => ({
        table: {
            fields: [
                { key: 'by_user', sortable: true },
                { key: 'module', sortable: true },
                { key: 'event', sortable: true },
                { key: 'created_at', sortable: true },
                { key: 'action' },
            ],
            items: [],
            busy: true,
        },
        modal: {},
        a: null,
        b: null,
    }),
    async fetch() {
        if (this.access['audits.show'])
            this.$axios.get('/admin/audit').then((r) => {
                this.table.items = r.data
                this.table.busy = false
            })
        else this.$router.push('/404')
    },
    methods: {
        show(type: string, key: any) {
            this.modal = key
            this.$bvModal.show('show')
        },
        warn(value: string): string {
            return value === 'created'
                ? 'text-info'
                : value === 'updated'
                ? 'text-success'
                : value === 'deleted'
                ? 'text-danger'
                : ''
        },
    },
    computed: {
        ...mapGetters(['access']),
        data() {
            let a = this.table

            if (this.a && this.b)
                a = {
                    ...a,
                    items: a.items.filter((i: any) => {
                        const z = new Date(i.created_at)

                        return (
                            z >= new Date((this as any).a) &&
                            z <= new Date((this as any).b)
                        )
                    }),
                }

            return a
        },
    },
})
</script>
