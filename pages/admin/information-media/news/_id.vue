<template>
  <b-card>
    <formulate-form name="news" @submit="send()">
      <b-row class="mb-2">
        <b-col cols="6">
          <formulate-input type="text" label="Title" v-model="form.title" validation="required" />
        </b-col>
        <b-col cols="6">
          <formulate-input
            type="image"
            label="Banner"
            v-model="form.banner"
            accept="image/jpg, image/jpeg, image/png, image/webp"
          />
          <div v-if="banner">
            <b-img fluid :src="sauce('storage/' + banner)" />
          </div>
          <small class="text-muted font-italic">Current banner</small>
        </b-col>
      </b-row>

      <formulate-input
        type="markdown"
        label="Content"
        v-model="form.content"
        validation="required"
      />

      <formulate-input label="Submit" type="submit" :disabled="clicked">
        <b-spinner v-if="clicked" variant="primary" small />
      </formulate-input>
    </formulate-form>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    data: () => ({
        form: {
            title: '',
            banner: null,
            content: '',
        },
        banner: '',
        clicked: false,
    }),
    async fetch() {
        if (this.access['news.update']) {
            if (Object.keys(this.news).length > 0)
                await new Promise((dispatch) => {
                    dispatch(
                        setTimeout(() => {
                            this.form.title = this.news.title
                            this.form.content = this.news.content
                            this.banner = this.news.banner
                        }, 250)
                    )
                })
            else
                await this.$axios
                    .get('/admin/media/news/edit/' + this.$route.params.id)
                    .then((r) => {
                        this.form.title = r.data.title
                        this.form.content = r.data.content
                        this.banner = r.data.banner
                    })
        } else this.$router.push('/404')
    },
    methods: {
        async send() {
            const form = new FormData(),
                f: any = this.form

            this.clicked = true

            Object.keys(f).forEach((i) => {
                if (i === 'banner' && f[i] !== null)
                    form.append(i, f[i].fileList[0])
                else if (f[i] !== null) form.append(i, f[i])
            })

            await this.$axios
                .post('/admin/media/news/update/' + this.$route.params.id, form)
                .then(async (r) => {
                    this.toast(r.data.message)
                    this.$router.push('/admin/information-media/news')
                })
                .catch((e) => {
                    this.catchErr(e)
                })

            this.clicked = false
        },
    },
    computed: {
        ...mapGetters(['access', 'news']),
    },
})
</script>
