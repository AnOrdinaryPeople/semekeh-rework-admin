<template>
  <div>
    <card v-if="ready" access-name="prestation">
      <create access-name="prestation">
        <formulate-form name="prestation" @submit="send()">
          <b-row class="mb-2">
            <b-col cols="4">
              <formulate-input
                type="text"
                label="Title"
                v-model="form.title"
                validation="required"
              />
            </b-col>

            <b-col cols="4">
              <formulate-input type="text" label="Rank" v-model="form.rank" validation="required" />
            </b-col>

            <b-col cols="4">
              <formulate-input
                type="number"
                label="Year"
                v-model="form.year"
                validation="required"
              />
            </b-col>
          </b-row>

          <formulate-input
            type="image"
            label="Image"
            v-model="form.url"
            validation="required|mime:image/jpg,image/jpeg,image/png,image/webp"
            accept="image/jpg, image/jpeg, image/png, image/webp"
          />

          <formulate-input label="Submit" type="submit" :disabled="clicked">
            <b-spinner v-if="clicked" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </create>

      <data-table type="prestation" :table="table" :show="show" :edit="edit" :del="del" />
    </card>

    <b-modal id="show" title="Detail" hide-footer>
      <h4 class="text-center">{{ modal.title }}</h4>
      <b-row class="mb-2 text-center">
        <b-col cols="6">
          <strong>Rank</strong>
          <p>{{ modal.rank }}</p>
        </b-col>
        <b-col cols="6">
          <strong>Year</strong>
          <p>{{ modal.year }}</p>
        </b-col>
      </b-row>

      <b-img fluid :src="sauce('storage/' + modal.url)" />
    </b-modal>

    <b-modal id="edit" title="Edit" size="lg" hide-footer>
      <form @submit.prevent="send('update/' + modal.id)">
        <b-row class="mb-2">
          <b-col cols="4">
            <b-form-group label="Title">
              <b-form-input v-model="modal.title" required />
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group label="Rank">
              <b-form-input v-model="modal.rank" required />
            </b-form-group>
          </b-col>
          <b-col cols="4">
            <b-form-group label="Year">
              <b-form-input type="number" v-model="modal.year" required />
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Image">
          <b-form-file v-model="modal.url" accept="image/jpg, image/jpeg, image/png, image/webp" />
        </b-form-group>

        <formulate-input label="Update" type="submit" :disabled="clicked">
          <b-spinner v-if="clicked" variant="primary" small />
        </formulate-input>
      </form>
    </b-modal>

    <b-modal
      id="del"
      title="Delete"
      header-bg-variant="danger"
      header-text-variant="light"
      hide-footer
    >
      <p>
        Are you sure want to
        <strong>delete</strong> this data? This action
        <strong>cannot</strong> be undone
      </p>
      <b-btn class="btn btn-danger" :disabled="clicked" @click="destroy(modal.id)">Yes</b-btn>
      <a href="#" class="btn btn-secondary" @click.prevent="$bvModal.hide('del')">No</a>
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
                { key: 'title', sortable: true },
                { key: 'rank', sortable: true },
                { key: 'action' },
            ],
            items: [],
            busy: true,
        },
        form: {
            title: '',
            rank: '',
            year: null,
            url: null,
        },
        clicked: false,
        modal: {},
        ready: false,
    }),
    async fetch() {
        if (this.access['prestation.show']) await this.refresh()
        else this.$router.push('/404')
    },
    methods: {
        async refresh() {
            this.$axios.get('/admin/media/prestation').then((r) => {
                this.table.items = r.data
                this.table.busy = false
                this.ready = true
            })
        },
        show(type: string, key: any) {
            this.modal = key
            ;(this as any).$bvModal.show('show')
        },
        edit(type: string, key: any) {
            this.modal = {}

            this.modal = { ...key, url: null }
            ;(this as any).$bvModal.show('edit')
        },
        del(type: string, key: any) {
            this.modal = key
            ;(this as any).$bvModal.show('del')
        },
        async send(target = 'create') {
            const form = new FormData(),
                f: any = target === 'create' ? this.form : this.modal

            this.clicked = true

            Object.keys(f).forEach((i: any) => {
                let val: any

                if (typeof f[i] === 'object' && f[i] !== null)
                    form.append(i, f[i].fileList[0])
                else if (f[i] !== null) form.append(i, f[i])
            })
            console.log(f)
            ;(this as any).logForm(form)

            await this.$axios
                .post('/admin/media/prestation/' + target, form)
                .then(async (r) => {
                    const t = this as any

                    await this.refresh()

                    if (target === 'create') t.$formulate.reset('prestation')
                    else t.$bvModal.hide('edit')

                    t.toast(r.data.message)
                })
                .catch((e) => {
                    ;(this as any).catchErr(e)
                })

            this.clicked = false
        },
        async destroy(id: string) {
            this.clicked = true

            await this.$axios
                .delete('/admin/media/prestation/delete/' + id)
                .then((r) => {
                    this.table.items = this.table.items.filter(
                        (i: any) => i.id !== id
                    )
                    ;(this as any).$bvModal.hide('del')
                    ;(this as any).toast(r.data.message)
                })
                .catch((e) => {
                    ;(this as any).catchErr(e)
                })

            this.clicked = false
        },
    },
    computed: {
        ...mapGetters(['access']),
    },
})
</script>
