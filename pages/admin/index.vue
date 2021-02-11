<template>
  <div>
    <!-- CAROUSEL SECTION -->

    <card access-name="homepage-carousel" title="Carousel">
      <create access-name="homepage-carousel">
        <formulate-form name="carousel" @submit="send('carousel')">
          <b-row class="form-group">
            <b-col cols="6">
              <formulate-input
                type="select"
                v-model="carousel.form.type"
                label="Type"
                placeholder="Choose Template"
                :options="{1: 'PNG Template', 2: 'JPEG Template'}"
                validation="required"
              />
              <b-img
                fluid
                v-if="carousel.form.type > 0"
                :src="sauce(`img/carousel-type-${carousel.form.type}.png`)"
              />
            </b-col>
            <b-col cols="6">
              <formulate-input
                type="image"
                v-model="carousel.form.url"
                label="Image"
                validation="required|mime:image/jpg,image/jpeg,image/png,image/webp"
                accept="image/jpg, image/jpeg, image/png, image/webp"
              />
            </b-col>
          </b-row>

          <formulate-input
            type="text"
            v-model="carousel.form.title"
            label="Title"
            validation="required"
          />
          <formulate-input
            type="textarea"
            v-model="carousel.form.description"
            label="Description"
            help="Nullable"
          />

          <formulate-input label="Submit" type="submit" :disabled="carousel.clicked">
            <b-spinner v-if="carousel.clicked" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </create>

      <data-table type="homepage-carousel" :table="carousel.table" :edit="edit" :del="del" />
    </card>

    <!-- VIDEO SECTION -->

    <card
      access-name="homepage-video"
      :title="cardTitle(0, 'Video')"
      :h-data="section[0]"
      @h-edit="edit"
    >
      <create access-name="homepage-video">
        <formulate-form name="video" @submit="send('video')">
          <b-row class="form-group">
            <b-col cols="6">
              <formulate-input
                type="image"
                v-model="video.form.thumbnail"
                label="Thumbnail"
                validation="required|mime:image/jpg,image/jpeg,image/png,image/webp"
                accept="image/jpg, image/jpeg, image/png, image/webp"
              />
            </b-col>
            <b-col cols="6">
              <formulate-input
                type="file"
                v-model="video.form.video"
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

          <formulate-input label="Submit" type="submit" :disabled="video.clicked">
            <b-spinner v-if="video.clicked" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </create>

      <data-table
        type="homepage-video"
        :table="video.table"
        :show="show"
        :del="del"
        :search="false"
      >
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

    <!-- ABOUT SECTION -->

    <card access-name="homepage-about">
      <div v-if="access['homepage-about.update'] && about.content">
        <b-card-title>
          <b-btn
            variant="info"
            title="Edit"
            v-b-tooltip.hover
            size="sm"
            @click="edit('section', section[1])"
          >
            <fa icon="pencil-alt" />
          </b-btn>
          &nbsp;{{ cardTitle(1, 'About') }}
        </b-card-title>

        <formulate-form name="about" @submit="sendAbout()">
          <b-row class="mb-2">
            <b-col sm="12" md="6" lg="8">
              <formulate-input type="markdown" v-model="about.content" validation="required" />
            </b-col>
            <b-col sm="12" md="6" lg="4">
              <formulate-input
                type="image"
                v-model="aboutImg"
                validation="mime:image/jpg,image/jpeg,image/png,image/webp"
                accept="image/jpg, image/jpeg, image/png, image/webp"
              />
              <b-img fluid :src="sauce('storage/' + about.url)" />
            </b-col>
          </b-row>
          <formulate-input label="Update" type="submit" :disabled="about.clicked">
            <b-spinner v-if="about.clicked" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </div>
      <div v-else>
        <b-card-title>{{ cardTitle(1, 'About') }}</b-card-title>
        <b-row v-if="about.content" class="mt-4">
          <b-col sm="12" md="6" lg="8">
            <markdown :content="about.content" />
          </b-col>
          <b-col sm="12" md="6" lg="4">
            <b-img fluid :src="sauce('storage/' + about.url)" />
          </b-col>
        </b-row>
      </div>
    </card>

    <!-- MISC. SECTION -->

    <b-card class="my-4">
      <b-row class="mb-4">
        <b-col cols="6">
          <b-card-title>
            <b-btn
              variant="info"
              title="Edit"
              v-b-tooltip.hover
              size="sm"
              @click="edit('section', section[2])"
            >
              <fa icon="pencil-alt" />
            </b-btn>
            &nbsp;{{ cardTitle(2, 'News') }}
          </b-card-title>
        </b-col>
        <b-col cols="6">
          <b-card-title>
            <b-btn
              variant="info"
              title="Edit"
              v-b-tooltip.hover
              size="sm"
              @click="edit('section', section[3])"
            >
              <fa icon="pencil-alt" />
            </b-btn>
            &nbsp;{{ cardTitle(3, 'Prestation') }}
          </b-card-title>
        </b-col>
      </b-row>

      <formulate-form name="foundation" @submit="send('foundation')">
        <formulate-input
          type="text"
          v-model="foundation.form.value"
          label="BPI Foundation URL"
          validation="required|regex_url"
          :validation-rules="{regex_url: ({ value }) => regexURL(value)}"
          :validation-messages="{regex_url: 'The link format is invalid'}"
        />
        <formulate-input label="Update" type="submit" :disabled="foundation.clicked">
          <b-spinner v-if="foundation.clicked" variant="primary" small />
        </formulate-input>
      </formulate-form>
    </b-card>

    <!-- ALUMNI SECTION -->

    <card
      access-name="homepage-alumni"
      :title="cardTitle(4, 'Alumni')"
      :h-data="section[4]"
      @h-edit="edit"
    >
      <create access-name="homepage-alumni">
        <formulate-form name="alumni" @submit="send('alumni')">
          <b-row>
            <b-col sm="12" md="6" lg="6">
              <formulate-input
                type="text"
                v-model="alumni.form.name"
                label="Name"
                validation="required"
              />
            </b-col>
            <b-col sm="12" md="6" lg="6">
              <formulate-input
                type="text"
                v-model="alumni.form.company"
                label="Company"
                validation="required"
              />
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col sm="12" md="6" lg="6">
              <formulate-input
                type="textarea"
                v-model="alumni.form.content"
                label="Content"
                validation="required"
              />
            </b-col>
            <b-col sm="12" md="6" lg="6">
              <formulate-input
                type="image"
                v-model="alumni.form.url"
                label="Image"
                validation="required|mime:image/jpg,image/jpeg,image/png,image/webp"
                accept="image/jpg, image/jpeg, image/png, image/webp"
              />
            </b-col>
          </b-row>
          <formulate-input label="Submit" type="submit" :disabled="alumni.clicked">
            <b-spinner v-if="alumni.clicked" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </create>

      <data-table type="homepage-alumni" :table="alumni.table" :show="show" :edit="edit" :del="del">
        <template #default="data">
          <b-btn
            v-if="access['homepage-alumni.update']"
            variant="success"
            size="sm"
            @click="videoPublish(data.cell.id, 'alumni')"
            v-b-tooltip.hover
            :title="`This alumni is ${data.cell.is_publish ? 'published' : 'not published'}`"
          >
            <fa :icon="data.cell.is_publish ? 'toggle-on' : 'toggle-off'" />
          </b-btn>
        </template>
      </data-table>
    </card>

    <!-- COMPANY SECTION -->

    <card
      access-name="homepage-company"
      :title="cardTitle(5, 'Company')"
      :h-data="section[5]"
      @h-edit="edit"
    >
      <create access-name="homepage-company">
        <formulate-form name="company" @submit="send('company')">
          <b-row class="mb-2">
            <b-col sm="12" md="6" lg="6">
              <formulate-input
                type="image"
                v-model="company.form.url"
                label="Image"
                validation="required|mime:image/jpg,image/jpeg,image/png,image/webp"
                accept="image/jpg, image/jpeg, image/png, image/webp"
              />
            </b-col>
            <b-col sm="12" md="6" lg="6">
              <formulate-input
                type="text"
                v-model="company.form.link"
                label="Link"
                validation="required|regex_url"
                :validation-rules="{regex_url: ({ value }) => regexURL(value)}"
                :validation-messages="{regex_url: 'The link format is invalid'}"
              />
            </b-col>
          </b-row>
          <formulate-input label="Submit" type="submit" :disabled="company.clicked">
            <b-spinner v-if="company.clicked" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </create>

      <data-table
        type="homepage-company"
        :table="company.table"
        :show="show"
        :edit="edit"
        :del="del"
      />
    </card>

    <!-- SOCIAL MEDIA SECTION -->

    <card access-name="homepage-social-media" title="Social Media">
      <create access-name="homepage-social-media">
        <formulate-form name="social" @submit="send('social')">
          <b-row class="mb-2">
            <b-col sm="12" md="6" lg="6">
              <formulate-input
                type="text"
                v-model="social.form.icon"
                label="Icon"
                validation="required"
              />
              <span>
                <a
                  href="https://fontawesome.com/icons?d=gallery&s=brands&m=free"
                  target="_blank"
                >Available icons</a>
              </span>
            </b-col>
            <b-col sm="12" md="6" lg="6">
              <formulate-input
                type="text"
                v-model="social.form.link"
                label="Link"
                validation="required|regex_url"
                :validation-rules="{regex_url: ({ value }) => regexURL(value)}"
                :validation-messages="{regex_url: 'The link format is invalid'}"
              />
            </b-col>
          </b-row>
          <formulate-input label="Submit" type="submit" :disabled="social.clicked">
            <b-spinner v-if="social.clicked" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </create>

      <data-table type="homepage-social-media" :table="social.table" :edit="edit" :del="del" />
    </card>

    <!-- FOOTER SECTION -->

    <card access-name="homepage-footer" title="Footer">
      <create access-name="homepage-footer">
        <formulate-form name="footer" @submit="send('footer')">
          <b-row class="mb-2">
            <b-col sm="12" md="6" lg="6">
              <formulate-input
                type="text"
                v-model="footer.form.key"
                label="Name"
                validation="required"
              />
            </b-col>
            <b-col sm="12" md="6" lg="6">
              <formulate-input
                type="text"
                v-model="footer.form.value"
                label="Value"
                validation="required"
              />
            </b-col>
          </b-row>
          <formulate-input label="Submit" type="submit" :disabled="footer.clicked">
            <b-spinner v-if="footer.clicked" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </create>

      <data-table type="homepage-footer" :table="footer.table" :edit="edit" :del="del" />
    </card>

    <!-- DETAIL MODAL -->

    <b-modal id="homepage-modal-show" title="Detail" hide-footer>
      <div v-if="modalType === 'video'">
        <b-row>
          <b-col cols="6">
            <a :href="sauce('storage/' + modalShow.thumbnail)" target="_blank">Thumbnail</a>
          </b-col>
          <b-col cols="6">
            <a :href="sauce('storage/' + modalShow.video)" target="_blank">Video</a>
          </b-col>
        </b-row>
        <b-embed controls type="video" :poster="sauce('storage/' + modalShow.thumbnail)">
          <source :src="sauce('storage/' + modalShow.video)" />
        </b-embed>
        <div class="mt-2">
          <strong :class="`text-${modalShow.is_publish ? 'success' : 'danger'}`">Status</strong>
          <p>{{ `This video is ${modalShow.is_publish ? 'published' : 'not published'}` }}</p>
        </div>
      </div>
      <div v-else-if="modalType === 'alumni'">
        <b-row class="mb-2">
          <b-col cols="6">
            <div class="mb-2">
              <strong>Name</strong>
              <p>{{ modalShow.name }}</p>
            </div>
            <strong>Company</strong>
            <p>{{ modalShow.company }}</p>
          </b-col>
          <b-col cols="6">
            <strong :class="`text-${modalShow.is_publish ? 'success' : 'danger'}`">Status</strong>
            <p>{{ `This alumni is ${modalShow.is_publish ? 'published' : 'not published'}` }}</p>
          </b-col>
        </b-row>
        <strong>Content</strong>
        <p>{{ modalShow.content }}</p>
        <b-img fluid :src="sauce('storage/' + modalShow.url)" />
      </div>
      <div v-else-if="modalType === 'company'">
        <div class="form-group">
          <a :href="modalShow.link" target="_blank">{{ modalShow.link }}</a>
        </div>
        <div class="form-group">
          <b-img fluid :src="sauce('storage/' + modalShow.url)" />
        </div>
      </div>
    </b-modal>

    <!-- EDIT MODAL -->

    <b-modal id="homepage-modal-edit" title="Edit" size="lg" hide-footer>
      <form @submit.prevent="send(modalType, true)">
        <div v-if="access['homepage-carousel.update'] && modalType === 'carousel'">
          <b-row class="mb-2">
            <b-col cols="6">
              <b-form-select
                v-model="modalEdit.type"
                :options="[{value: 1, text: 'PNG Template'}, {value: 2, text: 'JPEG Template'}]"
                required
              />
            </b-col>
            <b-col cols="6">
              <b-form-file
                v-model="modalEdit.url"
                accept="image/jpg, image/jpeg, image/png, image/webp"
              />
            </b-col>
          </b-row>

          <b-form-group label="Title">
            <b-form-input v-model="modalEdit.title" required />
          </b-form-group>

          <b-form-group label="Description">
            <b-form-textarea v-model="modalEdit.description" required />
          </b-form-group>
        </div>
        <div v-else-if="access['homepage-alumni.update'] && modalType === 'alumni'">
          <b-row>
            <b-col sm="12" md="6" lg="6">
              <b-form-group label="Name">
                <b-form-input v-model="modalEdit.name" required />
              </b-form-group>
            </b-col>
            <b-col sm="12" md="6" lg="6">
              <b-form-group label="Company">
                <b-form-input v-model="modalEdit.company" required />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="my-2">
            <b-col sm="12" md="6" lg="6">
              <label>Content</label>
              <b-form-textarea v-model="modalEdit.content" />
            </b-col>
            <b-col sm="12" md="6" lg="6">
              <label>Image</label>
              <b-form-file
                v-model="modalEdit.url"
                accept="image/jpg, image/jpeg, image/png, image/webp"
              />
            </b-col>
          </b-row>
        </div>
        <div v-else-if="access['homepage-company.update'] && modalType === 'company'">
          <b-row class="my-2">
            <b-col sm="12" md="6" lg="6">
              <label>Image</label>
              <b-form-file
                v-model="modalEdit.url"
                accept="image/jpg, image/jpeg, image/png, image/webp"
              />
            </b-col>
            <b-col sm="12" md="6" lg="6">
              <label>Link</label>
              <b-form-input v-model="modalEdit.link" required />
            </b-col>
          </b-row>
        </div>
        <div v-else-if="access['homepage-social-media.update'] && modalType === 'social'">
          <b-row class="my-2">
            <b-col sm="12" md="6" lg="6">
              <label>Icon</label>
              <b-form-input v-model="modalEdit.icon" required />
              <span>
                <a
                  :href="`https://fontawesome.com/icons?d=gallery&s=brands&m=fre&q=${modalEdit.icon}`"
                  target="_blank"
                >Available icons</a>
              </span>
            </b-col>
            <b-col sm="12" md="6" lg="6">
              <label>Link</label>
              <b-form-input v-model="modalEdit.link" required />
            </b-col>
          </b-row>
        </div>
        <div v-else-if="access['homepage-footer.update'] && modalType === 'footer'">
          <b-row class="my-2">
            <b-col sm="12" md="6" lg="6">
              <label>Name</label>
              <b-form-input v-model="modalEdit.key" required />
            </b-col>
            <b-col sm="12" md="6" lg="6">
              <label>Value</label>
              <b-form-input v-model="modalEdit.value" required />
            </b-col>
          </b-row>
        </div>
        <div v-else-if="modalType === 'section'">
          <b-row class="my-2">
            <b-col sm="12" md="6" lg="6">
              <label>Title</label>
              <b-form-input v-model="modalEdit.title" required />
            </b-col>
            <b-col sm="12" md="6" lg="6">
              <label>Subtitle</label>
              <b-form-input v-model="modalEdit.subtitle" required />
            </b-col>
          </b-row>
        </div>
        <formulate-input label="Update" type="submit" :disabled="modalEditBtn">
          <b-spinner v-if="modalEditBtn" variant="primary" small />
        </formulate-input>
      </form>
    </b-modal>

    <!-- DELETE MODAL -->

    <b-modal
      id="homepage-modal-del"
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
      <b-btn class="btn btn-danger" :disabled="modalDelBtn" @click="destroy(modalType)">Yes</b-btn>
      <a href="#" class="btn btn-secondary" @click.prevent="$bvModal.hide('homepage-modal-del')">No</a>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    data: () => {
        const template = (fields: any, form: object) => {
                fields.push({ key: 'action' })

                return {
                    table: {
                        fields,
                        items: [],
                        busy: true,
                    },
                    clicked: false,
                    form,
                }
            },
            modalEdit: any = {}

        return {
            carousel: template([{ key: 'title', sortable: true }], {
                type: null,
                title: '',
                description: '',
                url: null,
            }),
            video: template([{ key: 'thumbnail' }], {
                thumbnail: null,
                video: null,
            }),
            about: {},
            alumni: template(
                [
                    { key: 'name', sortable: true },
                    { key: 'company', sortable: true },
                ],
                {
                    name: '',
                    company: '',
                    content: '',
                    url: null,
                }
            ),
            company: template([{ key: 'link', sortable: true }], {
                url: null,
                link: '',
            }),
            social: template(
                [
                    { key: 'icon', sortable: true },
                    { key: 'link', sortable: true },
                ],
                {
                    icon: '',
                    link: '',
                }
            ),
            footer: template(
                [
                    { key: 'key', sortable: true },
                    { key: 'value', sortable: true },
                ],
                {
                    key: '',
                    value: '',
                }
            ),
            section: [],
            foundation: { form: { value: '' }, clicked: false },
            modalType: '',
            modalEdit,
            modalShow: {},
            modalEditBtn: false,
            modalDelBtn: false,
            aboutImg: null,
            videoLoad: 0,
        }
    },
    async fetch() {
        await this.$axios.get('/admin/homepage').then(({ data }: any) => {
            this.carousel.table.items = data.carousel
            this.carousel.table.busy = false

            this.foundation.form.value = data.foundation
            this.about = data.about
            ;(this as any).about.clicked = false
            this.section = data.section
        })
        const list = ['video', 'alumni', 'company', 'social', 'footer']

        for (const l of list) await this.refreshTable(l)
    },
    methods: {
        show(type: string, key: any) {
            this.edit(type, key, 'show')
        },
        edit(type: string, key: any, modal: string = 'edit') {
            type =
                type === 'homepage-social-media'
                    ? 'social'
                    : type.replace(/homepage-/g, '')

            this.setModal(type, key, modal)
            this.modalType = type
            ;(this as any).$bvModal.show('homepage-modal-' + modal)
        },
        del(type: string, key: any) {
            this.edit(type, key, 'del')
        },
        reqTable(type: string) {
            return this.$axios.get('/admin/homepage/' + type)
        },
        async refreshTable(type: string) {
            await this.reqTable(type).then((r) => {
                ;(this as any)[type].table.items = r.data
                ;(this as any)[type].table.busy = false
            })
        },
        async send(type: string, isUpdate: boolean = false) {
            const _this = this as any,
                url: string = `/admin/homepage/${
                    type + (type === 'foundation' ? '/1' : '')
                }/${isUpdate ? 'update/' + _this.modalEdit.id : 'create'}`,
                f = isUpdate ? _this.modalEdit : _this[type].form,
                form = new FormData()

            _this[type].clicked = true
            this.modalEditBtn = true

            Object.keys(f).forEach((o) => {
                let val: any

                try {
                    val = o === 'video' ? f[o].results[0].url : f[o].fileList[0]
                } catch (e) {
                    val = f[o]
                }

                form.append(o, val)
            })

            await this.$axios
                .post(url, form)
                .then(async (r) => {
                    await this.refreshTable(type)

                    if (type !== 'section' && type !== 'foundation')
                        _this.$formulate.reset(type)

                    this.videoLoad = 0

                    if (isUpdate) _this.$bvModal.hide('homepage-modal-edit')

                    _this.toast(r.data.message)
                })
                .catch((e) => {
                    _this.catchErr(e)
                })

            _this[type].clicked = false
            this.modalEditBtn = false
        },
        async destroy(type: string) {
            const _this = this as any

            this.modalDelBtn = true

            await this.$axios
                .delete(`/admin/homepage/${type}/delete/${_this.modalEdit.id}`)
                .then(async (r) => {
                    await this.refreshTable(type)
                    _this.$bvModal.hide('homepage-modal-del')

                    _this.toast(r.data.message)
                })
                .catch((e) => {
                    _this.catchErr(e)
                })

            this.modalDelBtn = false
        },
        async sendAbout() {
            const form = new FormData(),
                _this = this as any
            let img

            _this.about.clicked = true

            try {
                img = _this.aboutImg.fileList[0]
            } catch (e) {
                img = null
            }

            form.append('content', _this.about.content)
            form.append('url', img)

            await this.$axios
                .post('/admin/homepage/about/update', form)
                .then((r) => {
                    _this.$formulate.reset('about')
                    _this.about = r.data.result
                    _this.about.clicked = false

                    _this.toast(r.data.message)
                })
                .catch((e) => {
                    _this.catchErr(e)
                })

            _this.about.clicked = false
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
        videoPublish(id: any, type = 'video') {
            this.$axios
                .post(`/admin/homepage/${type}/publish/${id}`)
                .then((r) => {
                    this.refreshTable(type)
                    ;(this as any).toast(r.data.message)
                })
                .catch((e) => (this as any).catchErr(e))
        },
        cardTitle(key: number, origin: string) {
            let str = ''
            try {
                str = (this as any).section[key]?.title
            } catch (e) {
                str = origin
            }

            return str
        },
        setModal(type: string, key: any, from = '') {
            this.modalEdit = {}

            if (from === 'show') this.modalShow = key
            else Object.assign(this.modalEdit, key)

            if (type === 'video' && from === 'edit') {
                this.modalEdit.thumbnail = null
                this.modalEdit.video = null
            }

            if (
                (type === 'alumni' ||
                    type === 'company' ||
                    type === 'carousel') &&
                from === 'edit'
            )
                this.modalEdit.url = null
        },
        regexURL(value: string): boolean {
            return new RegExp(
                /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
            ).test(value)
        },
        beforeunload(e: any) {
            if (this.videoLoad > 0 && this.$auth.loggedIn)
                e.returnValue =
                    'Video is being uploaded. Are you sure you want to quit?'
        },
    },
    computed: {
        ...mapGetters(['access']),
    },
    beforeRouteLeave(to, from, next) {
        if (this.videoLoad > 0 && this.$auth.loggedIn) {
            if (
                window.confirm(
                    'Video is being uploaded. Are you sure you want to quit?'
                )
            )
                next()
            else next(false)
        } else next()
    },
    created() {
        window.addEventListener('beforeunload', this.beforeunload)
    },
    destroyed() {
        window.removeEventListener('beforeunload', this.beforeunload)
    },
})
</script>
