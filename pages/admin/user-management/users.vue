<template>
  <div>
    <card access-name="users">
      <create access-name="users">
        <formulate-form name="users" @submit="send()">
          <b-row class="mb-2">
            <b-col cols="6">
              <formulate-input type="text" label="Name" v-model="form.name" validation="required" />
            </b-col>
            <b-col cols="6">
              <formulate-input
                type="text"
                label="Email"
                v-model="form.email"
                validation="required|email"
              />
            </b-col>
          </b-row>

          <b-row class="mb-2">
            <b-col cols="6">
              <formulate-input
                type="password"
                label="Password"
                name="password"
                v-model="form.password"
                validation="required"
              />
            </b-col>
            <b-col cols="6">
              <formulate-input
                type="password"
                label="Confirm password"
                name="password_confirm"
                v-model="form.password_confirmation"
                validation="required|confirm"
                validation-name="Password confirmation"
              />
            </b-col>
          </b-row>

          <formulate-input
            type="select"
            v-model="form.role_id"
            label="Role"
            :options="role"
            validation="required"
          />

          <formulate-input label="Submit" type="submit" :disabled="clicked">
            <b-spinner v-if="clicked" variant="primary" small />
          </formulate-input>
        </formulate-form>
      </create>

      <data-table type="users" :table="table" :edit="edit">
        <template #default="data">
          <b-btn
            v-if="access['users.delete']"
            :variant="data.cell.is_active ? 'success' : 'danger'"
            size="sm"
            @click="del('', data.cell)"
            v-b-tooltip.hover
            :title="`This user is ${data.cell.is_active ? 'active' : 'inactive'}`"
          >
            <fa :icon="data.cell.is_active ? 'check' : 'times'" />
          </b-btn>
        </template>
      </data-table>
    </card>

    <b-modal id="edit" title="Edit" size="lg" hide-footer>
      <form @submit.prevent="send('update/' + modal.id)">
        <b-row>
          <b-col cols="6">
            <b-form-group label="Name">
              <b-form-input type="text" v-model="modal.name" required />
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group label="Email">
              <b-form-input type="text" v-model="modal.email" required />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="mb-2">
          <b-col cols="6">
            <b-form-group label="Password">
              <b-input-group>
                <b-input-group-prepend>
                  <b-btn variant="primary" @click="view = !view">
                    <fa :icon="view ? 'eye-slash' : 'eye'" />
                  </b-btn>
                </b-input-group-prepend>
                <b-form-input :type="view ? 'text' : 'password'" v-model="modal.password" />
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col cols="6">
            <b-form-group label="Confirm password">
              <b-input-group>
                <b-input-group-prepend>
                  <b-btn variant="primary" @click="vieww = !vieww">
                    <fa :icon="vieww ? 'eye-slash' : 'eye'" />
                  </b-btn>
                </b-input-group-prepend>
                <b-form-input
                  :type="vieww ? 'text' : 'password'"
                  v-model="modal.password_confirmation"
                />
              </b-input-group>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group>
          <b-form-select
            v-model="modal.role_id"
            :options="role.map(i => ({ value: i.value, text: i.label }))"
            required
          />
        </b-form-group>

        <formulate-input label="Update" type="submit" :disabled="clicked">
          <b-spinner v-if="clicked" variant="primary" small />
        </formulate-input>
      </form>
    </b-modal>

    <b-modal
      id="del"
      title="Confirmation"
      header-bg-variant="danger"
      header-text-variant="light"
      hide-footer
    >
      <p>
        Are you sure want to
        <strong>{{ !!modal.is_active ? 'inactive' : 'active' }}</strong> this user?
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
                { key: 'name', sortable: true },
                { key: 'email', sortable: true },
                { key: 'role', sortable: true },
                { key: 'action' },
            ],
            items: [],
            busy: true,
        },
        list: [],
        form: {
            type: '',
            key: '',
            value: '',
            password: '',
            password_confirmation: '',
            role_id: null,
        },
        modal: {},
        clicked: false,
        view: false,
        vieww: false,
    }),
    async fetch() {
        if (this.access['users.show']) this.render()
        else this.$router.push('/404')
    },
    methods: {
        async render() {
            await this.$axios.get('/admin/user').then((r) => {
                this.table.items = r.data.user
                this.table.busy = false
                this.list = r.data.role
            })
        },
        edit(type: string, key: any) {
            this.modal = {
                ...key,
                password: null,
                password_confirmation: null,
            }
            this.$bvModal.show('edit')
        },
        del(type: string, key: any) {
            this.modal = key
            this.$bvModal.show('del')
        },
        async send(url = 'create') {
            this.clicked = true

            await this.$axios
                .post(
                    '/admin/user/' + url,
                    url === 'create' ? this.form : this.modal
                )
                .then(async (r) => {
                    ;(this as any).$formulate.reset('users')
                    await this.render()

                    if (url !== 'create') this.$bvModal.hide('edit')

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
                .post('/admin/user/ban/' + (this as any).modal.id)
                .then(async (r) => {
                    await this.render()

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
        role(): any {
            const arr: any = []

            Object.keys(this.list).forEach((i: any) => {
                arr.push({
                    value: i,
                    label: this.list[i],
                })
            })
            console.log(arr)

            return arr
        },
    },
})
</script>
