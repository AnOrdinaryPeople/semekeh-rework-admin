<template>
  <div v-if="Object.keys(data).length">
    <b-card>
      <formulate-form @submit="send()">
        <b-row>
          <b-col cols="6">
            <formulate-input type="text" label="Title" v-model="data.title" validation="required" />
          </b-col>
          <b-col cols="6">
            <formulate-input
              type="image"
              label="Banner"
              v-model="data.banner"
              accept="image/jpg, image/jpeg, image/png, image/webp"
            />
            <div>
              <b-img fluid :src="sauce('storage/' + view.banner)" />
            </div>
            <small class="text-muted font-italic">Current banner</small>
          </b-col>
        </b-row>

        <formulate-input
          type="markdown"
          label="Content"
          v-model="data.content"
          validation="required"
        />

        <h2 class="my-4">Facility</h2>
        <b-row class="my-2">
          <b-col cols="6">
            <formulate-input type="text" label="Title" v-model="dataa.title" validation="required" />
          </b-col>
          <b-col cols="6">
            <formulate-input
              type="image"
              label="Image"
              v-model="data.url"
              accept="image/jpg, image/jpeg, image/png, image/webp"
            />
            <b-img fluid :src="sauce('storage/' + view.url)" />
            <small class="text-muted font-italic">Current image</small>
          </b-col>
        </b-row>

        <formulate-input
          type="markdown"
          label="Content"
          v-model="dataa.content"
          validation="required"
        />

        <formulate-input label="Update" type="submit" :disabled="clicked">
          <b-spinner v-if="clicked" variant="primary" small />
        </formulate-input>
      </formulate-form>
    </b-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    data: () => ({
        data: {},
        dataa: {},
        view: {},
        clicked: false,
    }),
    async fetch() {
        if (this.access['study-program.update']) {
            if (
                Object.keys(this.study).length > 0 &&
                this.id === this.study.slug
            )
                await new Promise((dispatch) =>
                    setTimeout(() => {
                        dispatch(this.setData(this.study))
                    }, 250)
                )
            else
                await this.$axios
                    .get('/admin/study-program/edit/' + this.id)
                    .then((r) => {
                        if (r.data) {
                            this.setData(r.data)
                            this.$store.dispatch('setStudy', r.data)
                        } else this.$router.push('/404')
                    })
        } else this.$router.push('/404')
    },
    methods: {
        setData(obj: any) {
            const a = JSON.parse(obj.content_2)

            this.data = {
                ...obj,
                banner: null,
            }
            this.dataa = {
                ...a,
                url: null,
            }
            this.view = {
                banner: obj.banner,
                url: a.url,
            }
        },
        async send() {
            const form = new FormData(),
                t = this as any

            this.clicked = true
            ;['data', 'dataa'].forEach((d, k) => {
                Object.keys(t[d]).forEach((i: any) => {
                    const str = i + (k === 1 ? '_2' : '')

                    // (i === 'banner' && t[d][i] !== null) || (i === 'url' && t[d][i] !== null)
                    if (typeof t[d][i] === 'object' && t[d][i] !== null)
                        form.append(str, t[d][i].fileList[0])
                    else if (t[d][i] !== null) form.append(str, t[d][i])
                })
            })

            await this.$axios
                .post('/admin/study-program/update/' + t.data.id, form)
                .then((r) => {
                    this.toast(r.data.message)

                    this.$router.push('/admin/study-program')
                })
                .catch((e) => {
                    this.catchErr(e)
                })

            this.clicked = false
        },
    },
    computed: {
        ...mapGetters(['access', 'study']),
        id(): string {
            return this.$route.params.id
        },
    },
})
</script>
