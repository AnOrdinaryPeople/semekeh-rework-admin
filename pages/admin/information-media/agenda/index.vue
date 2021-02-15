<template>
  <card access-name="agenda">
    <create access-name="agenda">
      <formulate-form name="agenda" @submit="send()">
        <formulate-input
          type="image"
          label="Banner"
          v-model="form.banner"
          validation="required|mime:image/jpg,image/jpeg,image/png,image/webp"
          accept="image/jpg, image/jpeg, image/png, image/webp"
        />

        <b-row class="mb-2">
          <b-col cols="6">
            <formulate-input type="text" label="Title" v-model="form.title" validation="required" />
          </b-col>
          <b-col cols="6">
            <formulate-input type="text" label="Held" v-model="form.time" validation="required" />
          </b-col>
        </b-row>

        <formulate-input
          type="markdown"
          label="Content"
          v-model="form.content"
          validation="required"
        />

        <formulate-input
          label="Submit"
          type="submit"
          :help="access['agenda.update'] || access['gallery.show'] ? 'After submitting it will go directly to the edit page' : ''"
          :disabled="clicked"
        >
          <b-spinner v-if="clicked" variant="primary" small />
        </formulate-input>
      </formulate-form>
    </create>

    <data-table type="agenda" :table="table" :show="show" :edit="edit" :del="del" />

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
      <b-btn class="btn btn-danger" :disabled="clicked.img" @click="destroy(modalType)">Yes</b-btn>
      <a href="#" class="btn btn-secondary" @click.prevent="$bvModal.hide('del')">No</a>
    </b-modal>
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
        form: {
            title: '',
            time: '',
            content: '',
            banner: null,
        },
        clicked: false,
        modal: {},
    }),
    async fetch() {
        if (this.access['agenda.show'])
            await this.$axios.get('/admin/media/agenda').then((r) => {
                this.table.items = r.data
                this.table.busy = false
            })
        else this.$router.push('/404')
    },
    methods: {
        show(type: string, key: any) {
            window.open(
                this.urlFE + '/information-media/agenda/' + key.slug,
                '_blank'
            )
        },
        edit(type: string, key: any) {
            this.$router.push('/admin/information-media/agenda/' + key.slug)
        },
        del(type: string, key: any) {
            this.modal = key
            this.$bvModal.show('del')
        },
        async send() {
            const form = new FormData(),
                t = this as any,
                f = t.form

            this.clicked = true

            Object.keys(f).forEach((o) => {
                let val

                try {
                    val = f[o].fileList[0]
                } catch (e) {
                    val = f[o]
                }
                form.append(o, val)
            })

            this.$axios
                .post('/admin/media/agenda/create', form)
                .then((r) => {
                    this.toast(r.data.message)

                    if (
                        this.access['agenda.update'] ||
                        this.access['gallery.show']
                    )
                        this.$router.push(
                            '/admin/information-media/agenda/' + r.data.slug
                        )
                    else t.$formulate.reset('agenda')
                })
                .catch((e) => {
                    this.catchErr(e)
                    this.clicked = false
                })
        },
        async destroy(id: string) {
            this.clicked = true

            await this.$axios
                .delete('/admin/media/agenda/delete/' + id)
                .then((r) => {
                    this.table.items = this.table.items.filter(
                        (i: any) => i.id !== id
                    )
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
    },
})
</script>
