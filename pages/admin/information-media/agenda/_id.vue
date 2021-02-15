<template>
  <div>
    <b-card v-if="access['agenda.update'] && ready">
      <formulate-form name="agenda" @submit="send()">
        <formulate-input
          type="image"
          label="Banner"
          v-model="form.banner"
          validation="required|mime:image/jpg,image/jpeg,image/png,image/webp"
          accept="image/jpg, image/jpeg, image/png, image/webp"
        />

        <b-row class="mb-2">
          <b-col class="mx-auto" cols="6">
            <b-img fluid :src="sauce(banner)" />
            <small class="text-muted font-italic">Current banner</small>
          </b-col>
        </b-row>

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

        <formulate-input label="Update" type="submit" :disabled="clicked.agenda">
          <b-spinner v-if="clicked.agenda" variant="primary" small />
        </formulate-input>
      </formulate-form>
    </b-card>

    <card access-name="gallery">
      <create access-name="gallery">
        <formulate-form name="gallery" @submit="sendImg()">
          <formulate-input
            type="image"
            v-model="img"
            label="Image"
            validation="required|mime:image/jpg,image/jpeg,image/png,image/webp"
            accept="image/jpg, image/jpeg, image/png, image/webp"
          />

          <formulate-input label="Submit" type="submit" :disabled="clicked.img">
            <b-spinner v-if="clicked.img" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </create>

      <data-table type="gallery" :table="table" :search="false" :del="del" />
    </card>

    <b-modal
      id="modal-del"
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
      <b-btn class="btn btn-danger" :disabled="clicked.img" @click="delImg()">Yes</b-btn>
      <a href="#" class="btn btn-secondary" @click.prevent="$bvModal.hide('modal-del')">No</a>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    data: () => ({
        ready: false,
        form: {},
        banner: '',
        table: {
            fields: [{ key: 'url' }, { key: 'action' }],
            items: [],
            busy: true,
        },
        clicked: {
            agenda: false,
            img: false,
        },
        img: null,
        delId: 0,
    }),
    async fetch() {
        if (this.access['agenda.update'] || this.access['gallery.show'])
            await this.render()
        else this.$router.push('/404')
    },
    methods: {
        async render() {
            await this.$axios
                .get('/admin/media/agenda/edit/' + this.id)
                .then((r) => {
                    this.banner = 'storage/' + r.data.agenda.banner
                    this.form = {
                        ...r.data.agenda,
                        banner: null,
                    }
                    this.table.items = r.data.img
                    this.table.busy = false
                    this.ready = true
                })
        },
        async send() {
            const form = new FormData(),
                t = this as any

            this.clicked.agenda = true

            Object.keys(this.form).forEach((i: any) => {
                // let val: any

                // try {
                //     val = t.form[i].fileList[0]
                // } catch (e) {
                //     val = t.form[i]
                // }

                // form.append(i, val)

                if (typeof t.form[i] === 'object' && t.form[i] !== null)
                    form.append(i, t.form[i].fileList[0])
                else if (t.form[i] !== null) form.append(i, t.form[i])
            })

            await this.$axios
                .post('/admin/media/agenda/update/' + t.form.id, form)
                .then((r) => {
                    this.toast(r.data.message)
                    this.$router.push('/admin/information-media/agenda')
                })
                .catch((e) => {
                    this.catchErr(e)
                })

            this.clicked.agenda = false
        },
        del(type: string, key: any) {
            this.delId = key.id
            this.$bvModal.show('modal-del')
        },
        async sendImg() {
            const f = new FormData(),
                _this = this as any

            this.clicked.img = true

            f.append('url', _this.img.fileList[0])

            await this.$axios
                .post(`admin/media/agenda/img/create/${_this.form.id}`, f)
                .then((r) => {
                    _this.$formulate.reset('gallery')
                    this.clicked.img = false
                    this.render()

                    this.toast(r.data.message)
                })
                .catch((e) => {
                    this.catchErr(e)
                })

            this.clicked.img = false
        },
        async delImg() {
            this.clicked.img = true

            await this.$axios
                .delete('admin/media/agenda/img/delete/' + this.delId)
                .then(async (r) => {
                    await this.render()

                    this.$bvModal.hide('modal-del')

                    this.toast(r.data.message)
                })
                .catch((e) => {
                    this.catchErr(e)
                })

            this.clicked.img = false
        },
    },
    computed: {
        ...mapGetters(['access']),
        id(): string {
            return this.$route.params.id
        },
    },
})
</script>
