<template>
  <div v-if="ready">
    <card :access-name="acc" access-target="update" :title="content.title">
      <formulate-form name="content" @submit="send()">
        <b-row class="mb-2">
          <b-col cols="6">
            <formulate-input
              type="text"
              label="Title"
              v-model="content.title"
              validation="required"
            />
          </b-col>
          <b-col cols="6">
            <formulate-input
              type="text"
              label="Subtitle"
              v-model="content.subtitle"
              help="Nullable"
            />
          </b-col>
        </b-row>

        <formulate-input
          type="markdown"
          label="Content"
          v-model="content.content"
          validation="required"
        />

        <formulate-input type="submit" label="Update" :disabled="clicked.content">
          <b-spinner v-if="clicked.content" variant="primary" small />
        </formulate-input>
      </formulate-form>
    </card>

    <b-card v-if="id === 3 && access['student-council.update']">
      <formulate-input type="text" label="Title" v-model="council.title" />
      <chart :obj="council.json" :config="config" :edit="true" />

      <div class="mt-4">
        <b-btn variant="success" :disabled="clicked.council" @click="save()">Update</b-btn>
      </div>
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
        content: {},
        table: {
            fields: [{ key: 'url', label: 'Image' }, { key: 'action' }],
            items: [],
            busy: true,
        },
        council: { title: '', json: [] },
        clicked: {
            content: false,
            council: false,
            img: false,
        },
        img: null,
        delId: 0,
        config: {
            nodeBinding: {
                field_0: 'name',
                field_1: 'title',
                field_2: 'sub',
            },
            nodeMenu: {
                edit: { text: 'Edit' },
                // add: { text: 'Add' },
                // remove: { text: 'Remove' }
            },
            enableDragDrop: true,
        },
    }),
    async fetch() {
        await this.render()
    },
    methods: {
        async render() {
            this.ready = false

            if (
                this.id > 0 &&
                (this.access[this.acc + '.show'] ||
                    this.access['gallery.show'] ||
                    this.access['student-council.update'])
            ) {
                await this.$axios
                    .get('/admin/profile/' + this.id)
                    .then(async (r) => {
                        this.content = r.data.table
                        this.table.items = r.data.img
                        this.table.busy = false

                        if (this.id === 3)
                            await this.$axios
                                .get('/admin/profile/council/get')
                                .then((r) => {
                                    this.council = {
                                        title: r.data.title,
                                        json: JSON.parse(r.data.json),
                                    }
                                })
                                .catch((e) => {
                                    ;(this as any).catchErr(e)
                                })
                    })
                    .catch((e) => {
                        ;(this as any).catchErr(e)
                    })

                this.ready = true
            } else this.$router.push('/404')
        },
        async send() {
            this.clicked.content = true

            await this.$axios
                .post('/admin/profile/update/' + this.id, this.content)
                .then((r) => {
                    ;(this as any).toast(r.data.message)
                })
                .catch((e) => {
                    ;(this as any).catchErr(e)
                })

            this.clicked.content = false
        },
        async save() {
            if (this.council.title && this.council.json.length) {
                this.clicked.council = true

                await this.$axios
                    .post('/admin/profile/council/update', {
                        title: this.council.title,
                        json: JSON.stringify(this.council.json),
                    })
                    .then((r) => {
                        ;(this as any).toast(r.data.message)
                    })
                    .catch((e) => {
                        ;(this as any).catchErr(e)
                    })

                this.clicked.council = false
            }
        },
        async sendImg() {
            const f = new FormData(),
                _this = this as any

            this.clicked.img = true

            f.append('url', _this.img.fileList[0])

            await this.$axios
                .post(`admin/profile/img/create/${this.id}`, f)
                .then((r) => {
                    _this.$formulate.reset('gallery')
                    this.clicked.img = false
                    this.render()

                    _this.toast(r.data.message)
                })
                .catch((e) => {
                    _this.catchErr(e)
                })

            this.clicked.img = false
        },
        del(type: string, key: any) {
            this.delId = key.id
            ;(this as any).$bvModal.show('modal-del')
        },
        async delImg() {
            const _this = this as any

            this.clicked.img = true

            await this.$axios
                .delete('admin/profile/img/delete/' + this.delId)
                .then(async (r) => {
                    await this.render()

                    _this.$bvModal.hide('modal-del')

                    _this.toast(r.data.message)
                })
                .catch((e) => {
                    _this.catchErr(e)
                })

            this.clicked.img = false
        },
    },
    computed: {
        ...mapGetters(['access']),
        id(): number {
            const id = this.acc

            return id === 'public-profile'
                ? 1
                : id === 'vision-mission'
                ? 2
                : id === 'student-council'
                ? 3
                : id === 'extracurricular'
                ? 4
                : 0
        },
        acc(): string {
            return this.$route.params.id
        },
    },
    watch: {
        '$route.params.id': function () {
            this.render()
        },
    },
})
</script>