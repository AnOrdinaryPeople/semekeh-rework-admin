<template>
  <b-card v-if="auth.name" :title="auth.name">
    <formulate-form @submit="send()">
      <b-row>
        <b-col cols="6">
          <strong>Email</strong>
          <p>{{ auth.email }}</p>
        </b-col>
        <b-col cols="6">
          <strong>Role</strong>
          <p>{{ role }}</p>
        </b-col>
      </b-row>

      <formulate-input type="text" label="Name" v-model="name" validation="required" />

      <b-row class="mb-2">
        <b-col cols="6">
          <b-form-group :disabled="passChange" label="New password">
            <b-input-group>
              <b-input-group-prepend>
                <b-btn variant="primary" @click="view = !view">
                  <fa :icon="view ? 'eye-slash' : 'eye'" />
                </b-btn>
              </b-input-group-prepend>
              <b-form-input :type="view ? 'text' : 'password'" v-model="pass" />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group :disabled="passChange" label="Confirm password">
            <b-input-group>
              <b-input-group-prepend>
                <b-btn variant="primary" @click="vieww = !vieww">
                  <fa :icon="vieww ? 'eye-slash' : 'eye'" />
                </b-btn>
              </b-input-group-prepend>
              <b-form-input :type="vieww ? 'text' : 'password'" v-model="passConfirm" />
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>

      <formulate-input
        type="password"
        label="Old password"
        v-model="passOld"
        validation="required"
      />

      <div class="d-flex">
        <formulate-input label="Update" type="submit" :disabled="clicked">
          <b-spinner v-if="clicked" variant="primary" small />
        </formulate-input>

        <div>
          <a
            href="#"
            class="btn btn-primary ml-4"
            @click.prevent="passChange = !passChange"
          >Toggle password</a>
        </div>
      </div>
    </formulate-form>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    data: () => ({
        pass: '',
        passConfirm: '',
        passOld: '',
        passChange: true,
        view: false,
        vieww: false,
        clicked: false,
        name: '',
    }),
    mounted() {
        this.name = JSON.parse(JSON.stringify(this.auth.name))
    },
    methods: {
        async send() {
            this.clicked = true

            let obj: any = {
                name: this.name,
                pass: this.passOld,
            }

            if (this.passChange) {
                obj['password'] = this.pass
                obj['password_confirmation'] = this.passConfirm
            }

            await this.$axios
                .post('/api/auth/update', obj)
                .then(async (r) => {
                    await this.$auth.fetchUser()

                    this.toast(r.data.message)
                })
                .catch((e) => {
                    this.catchErr(e)
                })

            this.clicked = false
        },
    },
    computed: {
        ...mapGetters(['role']),
        auth(): any {
            const u = this.$auth.user

            return {
                name: u?.name,
                email: u?.email,
            }
        },
    },
})
</script>
