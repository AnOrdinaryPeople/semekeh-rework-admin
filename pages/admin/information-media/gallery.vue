<template>
  <div v-if="ready">
    <card access-name="gallery" title="Gallery">
      <create access-name="gallery">
        <formulate-form name="gallery" @submit="sendImg()">
          <formulate-input
            type="image"
            v-model="img"
            label="Image"
            validation="required|mime:image/jpg,image/jpeg,image/png,image/webp"
            accept="image/jpg, image/jpeg, image/png, image/webp"
          />

          <formulate-input label="Submit" type="submit" :disabled="clicked">
            <b-spinner v-if="clicked" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </create>

      <data-table type="gallery" :table="table" :search="false" :del="del" />
    </card>

    <card access-name="homepage-video" title="Video">
      <create access-name="homepage-video">
        <formulate-form name="video" @submit="send()">
          <b-row class="form-group">
            <b-col cols="6">
              <formulate-input
                type="image"
                v-model="video.thumbnail"
                label="Thumbnail"
                validation="required|mime:image/jpg,image/jpeg,image/png,image/webp"
                accept="image/jpg, image/jpeg, image/png, image/webp"
              />
            </b-col>
            <b-col cols="6">
              <formulate-input
                type="file"
                v-model="video.video"
                label="Video"
                validation="required|mime:video/mp4,video/webm"
                accept="video/m4v, video/mp4, video/webm"
                :uploader="uploadFile"
              />
              <b-progress
                v-if="videoLoad > 0 && videoLoad < 100"
                :value="videoLoad"
                variant="success"
                animated
              />
            </b-col>
          </b-row>

          <formulate-input label="Submit" type="submit" :disabled="clicked">
            <b-spinner v-if="clicked" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </create>

      <data-table type="homepage-video" :table="tablee" :show="show" :del="del" :search="false">
        <template #default="data">
          <b-btn
            v-if="access['homepage-video.update']"
            variant="success"
            size="sm"
            @click="videoPublish(data.cell.id)"
            v-b-tooltip.hover
            :title="`This video is ${data.cell.is_publish ? 'published' : 'not published'}`"
          >
            <fa :icon="data.cell.is_publish ? 'toggle-on' : 'toggle-off'" />
          </b-btn>
        </template>
      </data-table>
    </card>

    <b-modal id="show" title="Detail" hide-footer>
      <b-row>
        <b-col cols="6">
          <a :href="sauce('storage/' + modal.thumbnail)" target="_blank">Thumbnail</a>
        </b-col>
        <b-col cols="6">
          <a :href="sauce('storage/' + modal.video)" target="_blank">Video</a>
        </b-col>
      </b-row>
      <b-embed controls type="video" :poster="sauce('storage/' + modal.thumbnail)">
        <source :src="sauce('storage/' + modal.video)" />
      </b-embed>
      <div class="mt-2">
        <strong :class="`text-${modal.is_publish ? 'success' : 'danger'}`">Status</strong>
        <p>{{ `This video is ${modal.is_publish ? 'published' : 'not published'}` }}</p>
      </div>
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
      <b-btn class="btn btn-danger" :disabled="clicked" @click="destroy()">Yes</b-btn>
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
            fields: [{ key: 'url' }, { key: 'action' }],
            items: [],
            busy: true,
        },
        tablee: {
            fields: [{ key: 'thumbnail' }, { key: 'action' }],
            items: [],
            busy: true,
        },
        ready: false,
        img: null,
        video: {
            thumbnail: null,
            video: null,
        },
        id: 0,
        modalType: '',
        clicked: false,
        videoLoad: 0,
        modal: {},
    }),
    async fetch() {
        await this.render()
    },
    methods: {
        async render(bool = true) {
            await this.$axios.get('/admin/media/gallery').then((r) => {
                this.table.items = r.data
                this.table.busy = false
            })

            if (bool) await this.renderVid()

            this.ready = true
        },
        async renderVid() {
            await this.$axios.get('/admin/homepage/video').then((r) => {
                this.tablee.items = r.data
                this.tablee.busy = false
            })
        },
        show(type: string, key: any) {
            this.modal = key
            this.$bvModal.show('show')
        },
        del(type: string, key: any) {
            this.id = key.id
            this.modalType = type.replace(/homepage-/g, '')
            this.$bvModal.show('del')
        },
        async sendImg() {
            const f = new FormData()

            this.clicked = true

            f.append('url', (this as any).img.fileList[0])

            await this.$axios
                .post('/admin/media/gallery/create', f)
                .then(async (r) => {
                    ;(this as any).$formulate.reset('gallery')

                    await this.render()

                    this.toast(r.data.message)
                })
                .catch((e) => {
                    this.catchErr(e)
                })

            this.clicked = false
        },
        async destroy() {
            this.clicked = true

            await this.$axios
                .delete(
                    `/admin/${
                        this.modalType === 'gallery'
                            ? 'media/gallery'
                            : 'homepage/video'
                    }/delete/${this.id}`
                )
                .then(async (r) => {
                    if (this.modalType === 'gallery') await this.render(false)
                    else await this.renderVid()

                    this.$bvModal.hide('del')

                    this.toast(r.data.message)
                })
                .catch((e) => {
                    this.catchErr(e)
                })

            this.clicked = false
        },
        async uploadFile(file: any, progress: any, error: any, options: any) {
            try {
                const form = new FormData()

                form.append('file', file)

                const result = await this.$axios.post(
                    '/admin/homepage/upload',
                    form,
                    {
                        onUploadProgress: (e) =>
                            (this.videoLoad = Math.round(
                                (e.loaded * 100) / e.total
                            )),
                    }
                )
                progress(100)
                return result.data
            } catch (e) {
                error('Failed to upload')
            }
        },
        async send() {
            const f: any = this.video,
                form = new FormData()

            this.clicked = true

            Object.keys(f).forEach((i) => {
                form.append(
                    i,
                    i === 'video' ? f[i].results[0].url : f[i].fileList[0]
                )
            })

            await this.$axios
                .post('/admin/homepage/video/create', form)
                .then((r) => {
                    ;(this as any).$formulate.reset('video')
                    this.videoLoad = 0
                    this.renderVid()

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
