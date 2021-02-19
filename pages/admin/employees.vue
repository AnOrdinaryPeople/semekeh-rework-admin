<template>
  <div>
    <card access-name="employees">
      <create access-name="employees">
        <formulate-form name="employees" @submit="send()">
          <b-row class="mb-2">
            <b-col sm="12" md="6" lg="6">
              <formulate-input type="text" v-model="form.name" label="Name" validation="required" />
            </b-col>
            <b-col sm="12" md="6" lg="6">
              <formulate-input
                type="text"
                v-model="form.title"
                label="Title"
                validation="required"
              />
            </b-col>
          </b-row>
          <formulate-input
            v-model="form.type"
            :options="{1: 'Productive', 2: 'Teacher', 3: 'Employee'}"
            type="select"
            label="Type"
            validation="required"
          />
          <formulate-input
            type="image"
            v-model="form.url"
            label="Image"
            validation="required|mime:image/jpg,image/jpeg,image/png,image/webp"
            accept="image/jpg, image/jpeg, image/png, image/webp"
          />
          <formulate-input label="Submit" type="submit" :disabled="clicked">
            <b-spinner v-if="clicked" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </create>

      <div v-for="(i, k) in Object.keys(table)" :key="k" class="mb-4">
        <h3>{{ title[k] }}</h3>

        <data-table
          type="employees"
          :table="table[i]"
          :show="show"
          :edit="edit"
          :del-emp="del"
          :emp-key="k"
        />
      </div>
    </card>

    <card access-name="gallery">
      <create access-name="gallery">
        <formulate-form name="gallery" @submit="send('img/create')">
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

      <data-table type="gallery" :table="tableImg" :search="false" :del="del" />
    </card>

    <b-modal id="show" title="Detail" hide-footer>
      <h4 class="text-center">{{ modal.title }}</h4>
      <b-row class="mb-2 text-center">
        <b-col cols="6">
          <strong>Name</strong>
          <p>{{ modal.name }}</p>
        </b-col>
        <b-col cols="6">
          <strong>Title</strong>
          <p>{{ modal.title }}</p>
        </b-col>
      </b-row>

      <b-row no-gutters>
        <b-col class="mx-auto" cols="6">
          <b-img fluid :src="sauce('storage/' + modal.url)" />
        </b-col>
      </b-row>
    </b-modal>

    <b-modal id="edit" title="Edit" size="lg" hide-footer>
      <form @submit.prevent="send('update/' + modal.id)">
        <b-row class="mb-2">
          <b-col cols="6">
            <b-form-group label="Name">
              <b-form-input v-model="modal.name" required />
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group label="Title">
              <b-form-input v-model="modal.title" required />
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group v-if="modal.type !== 1" label="Type">
          <b-form-select
            v-model="modal.type"
            :options="[{value: 2, text: 'Teacher'}, {value: 3, text: 'Employee'},]"
          />
        </b-form-group>
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
      <b-btn class="btn btn-danger" :disabled="clicked" @click="destroy()">Yes</b-btn>
      <a href="#" class="btn btn-secondary" @click.prevent="$bvModal.hide('del')">No</a>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    data: () => {
        const obj: any = () => ({
            fields: [
                { key: 'name', sortable: true },
                { key: 'title', sortable: true },
                { key: 'action' },
            ],
            items: [],
            busy: true,
        })

        return {
            title: [
                'Structural',
                'Head of the Vocational Program',
                'Productive',
                'Teachers',
                'Employees',
            ],
            table: {
                first: obj(),
                firstt: obj(),
                firsttt: obj(),
                second: obj(),
                third: obj(),
            },
            tableImg: {
                fields: [{ key: 'url' }, { key: 'action' }],
                items: [],
                busy: true,
            },
            form: {
                name: '',
                title: '',
                type: null,
                url: null,
            },
            img: null,
            delTarget: '',
            delId: null,
            clicked: false,
            modal: {},
        }
    },
    async fetch() {
        if (this.access['employees.show']) await this.render()
        else this.$router.push('/404')
    },
    methods: {
        async render() {
            await this.$axios.get('/admin/employee').then((r) => {
                const t = r.data.employee,
                    arr = [
                        ['first', 1, true],
                        ['firstt', 2, true],
                        ['firsttt', 3, true],
                        ['second', 2, false],
                        ['third', 3, false],
                    ]
                let a = (this as any).table

                arr.forEach((i: any) => {
                    a[i[0]].items = t.filter((j: any) =>
                        i[2]
                            ? j.type === 1 && j.child_type === i[1]
                            : j.type === i[1]
                    )

                    a[i[0]].busy = false
                })

                this.tableImg.items = r.data.img
                this.tableImg.busy = false
            })
        },
        show(type: string, key: any, modal = 'show') {
            if (modal === 'edit')
                this.modal = {
                    ...key,
                    url: null,
                }
            else this.modal = key

            this.$bvModal.show(modal)
        },
        edit(type: string, key: any) {
            this.show(type, key, 'edit')
        },
        del(type: string, key: any) {
            this.delTarget = type
            this.delId = key.id
            this.show(type, key, 'del')
        },
        async send(target = 'create') {
            const form = new FormData(),
                f: any = target === 'create' ? this.form : this.modal

            this.clicked = true

            Object.keys(f).forEach((i) => {
                if (typeof f[i] === 'object' && f[i] !== null)
                    form.append(
                        i,
                        i === 'video' ? f[i].results[0].url : f[i].fileList[0]
                    )
                else if (f[i] !== null) form.append(i, f[i])
            })

            await this.$axios
                .post('/admin/employee/' + target, form)
                .then(async (r) => {
                    this.render()

                    if (target !== 'create') this.$bvModal.hide('edit')
                    else (this as any).$formulate.reset('employees')

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
                    `/admin/employee${
                        this.delTarget === 'gallery' ? '/img' : ''
                    }/delete/${this.delId}`
                )
                .then((r) => {
                    this.render()

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
