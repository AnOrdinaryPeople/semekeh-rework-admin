<template>
  <card access-name="settings">
    <div v-if="access['settings.update']">
      <formulate-form name="foundation" @submit="sendd()">
        <formulate-input
          type="text"
          v-model="foundation"
          label="BPI Foundation URL"
          validation="required|regex_url"
          :validation-rules="{regex_url: ({ value }) => new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi).test(value)}"
          :validation-messages="{regex_url: 'The link format is invalid'}"
        />
        <formulate-input label="Update" type="submit" :disabled="clicked">
          <b-spinner v-if="clicked" variant="primary" small />
        </formulate-input>
      </formulate-form>
    </div>
    <div v-else>
      <strong>BPI Foundation URL</strong>
      <p>{{ foundation }}</p>
    </div>

    <div v-if="access['settings.update']" class="my-5">
      <label>Cache database manually</label>
      <b-form-select class="mb-2" v-model="timer" :options="timerList" />
      <b-btn
        block
        variant="info"
        @click="send()"
      >Cache the database {{ timer ? 'for ' + timerr : '' }}</b-btn>
      <b-row class="text-muted">
        <b-col cols="6">
          <small>Cache expiration based on recent cache</small>
        </b-col>
        <b-col class="text-right" cols="6">
          <small v-if="latest">Latest cache by {{ latest.name }} at {{ latest.created_at }}</small>
        </b-col>
      </b-row>
    </div>

    <h3>Cache History</h3>
    <data-table type="settings" :table="table" />
    <small class="text-muted">Auto cache will be refresh and delete the history monthly</small>

    <b-overlay no-wrap :show="clickedd" spinner-variant="info" />
  </card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    data: () => ({
        foundation: '',
        timerList: [
            { value: 'year', text: '1 year' },
            { value: 'month', text: '1 month' },
            { value: 'week', text: '1 week' },
            { value: 'day', text: '1 day' },
            { value: 'days', text: '3 days' },
        ],
        timer: 'month',
        table: {
            fields: [
                { key: 'name', sortable: true },
                { key: 'duration', sortable: true },
                { key: 'expire', sortable: true },
                { key: 'created_at', sortable: true },
            ],
            items: [],
            busy: true,
        },
        clicked: false,
        clickedd: false,
    }),
    async fetch() {
        if (this.access['settings.show'])
            await this.$axios.get('/admin/settings').then((r) => {
                this.foundation = r.data.foundation
                this.table.items = r.data.table
                this.table.busy = false
            })
        else this.$router.push('/404')
    },
    methods: {
        async send() {
            this.clickedd = true

            await this.$axios
                .post('/admin/settings/cache', { timer: this.timer })
                .then((r) => {
                    setTimeout(() => {
                        this.clickedd = false

                        this.table.items = r.data.table

                        this.toast(r.data.message)
                    }, 5000)
                })
                .catch((e) => {
                    this.clickedd = false
                    this.catchErr(e)
                })
        },
        async sendd() {
            this.clicked = true

            await this.$axios
                .post('/admin/settings/foundation/1', {
                    value: this.foundation,
                })
                .then((r) => {
                    this.toast(r.data.message)
                })
                .catch((e) => {
                    this.catchErr(e)
                })

            this.clicked = false
        },
    },
    computed: {
        ...mapGetters(['access']),
        timerr() {
            return this.timerList.filter((i) => i.value === this.timer)[0].text
        },
        latest() {
            return this.table.items[0]
        },
    },
})
</script>
