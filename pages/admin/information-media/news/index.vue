<template>
  <div>
    <card access-name="news">
      <create access-name="news">
        <formulate-form name="news" @submit="send()">
          <b-row class="mb-2">
            <b-col cols="6">
              <formulate-input
                type="text"
                label="Title"
                v-model="form.title"
                validation="required"
              />
            </b-col>
            <b-col cols="6">
              <formulate-input
                type="image"
                label="Banner"
                v-model="form.banner"
                validation="required|mime:image/jpg,image/jpeg,image/png,image/webp"
                accept="image/jpg, image/jpeg, image/png, image/webp"
              />
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
      </create>

      <data-table type="news" :table="table" :show="show" :edit="edit" :del="del" />
    </card>

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
            fields: [{ key: 'title', sortable: true }, { key: 'action' }],
            items: [],
            busy: true,
        },
        form: {
            title: '',
            banner: null,
            content: '',
        },
        id: 0,
        clicked: false,
    }),
    async fetch() {
        if (this.access['news.show']) await this.render()
        else this.$router.push('/404')
    },
    methods: {
        async render() {
            await this.$axios.get('/admin/media/news').then((r) => {
                this.table.items = r.data
                this.table.busy = false
            })
        },
        show(type: string, key: any) {
            window.open(
                this.urlFE + '/information-media/news/' + key.slug,
                '_blank'
            )
        },
        edit(type: string, key: any) {
            this.$store.dispatch('setNews', key)
            this.$router.push('/admin/information-media/news/' + key.slug)
        },
        del(type: string, key: any) {
            this.id = key.id
            this.$bvModal.show('del')
        },
        async send() {
            const form = new FormData(),
                f: any = this.form

            this.clicked = true

            Object.keys(f).forEach((i) => {
                if (i === 'banner') form.append(i, f[i].fileList[0])
                else form.append(i, f[i])
            })

            await this.$axios
                .post('/admin/media/news/create', form)
                .then(async (r) => {
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
                .delete('/admin/media/news/delete/' + this.id)
                .then((r) => {
                    this.table.items = this.table.items.filter(
                        (i: any) => i.id !== this.id
                    )
                    this.$bvModal.hide('del')

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
