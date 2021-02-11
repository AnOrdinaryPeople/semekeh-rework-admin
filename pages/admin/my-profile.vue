<template>
  <b-card :title="$auth.user.name">
    <formulate-form @submit="send()">
      <b-row>
        <b-col cols="6">
          <strong>Email</strong>
          <p>{{ $auth.user.email }}</p>
        </b-col>
        <b-col cols="6">
          <strong>Role</strong>
          <p>{{ role }}</p>
        </b-col>
      </b-row>

      <formulate-input type="text" label="Name" v-model="$auth.user.name" validation="required" />

      <b-row class="mb-2">
        <b-col cols="6">
          <b-form-group :disabled="passChange" label="New Password">
            <b-input-group>
              <b-input-group-prepend>
                <b-btn variant="bpi-blue" @click="view = !view">
                  <fa :icon="view ? 'eye-slash' : 'eye'" />
                </b-btn>
              </b-input-group-prepend>
              <b-form-input :type="view ? 'text' : 'password'" v-model="pass" />
            </b-input-group>
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group :disabled="passChange" label="Confirm Password">
            <b-input-group>
              <b-input-group-prepend>
                <b-btn variant="bpi-blue" @click="vieww = !vieww">
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
          >Change password</a>
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
    }),
    methods: {
        async send() {
            const _this = this as any

            this.clicked = true

            let obj: any = {
                name: _this.$auth.user.name,
                pass: this.passOld,
            }

            if (this.passChange) {
                obj['password'] = this.pass
                obj['password_confirmation'] = this.passConfirm
            }

            await this.$axios
                .post('/api/auth/update', obj)
                .then((r) => {
                    _this.toast(r.data.message)
                })
                .catch((e) => {
                    _this.catchErr(e)
                })

            this.clicked = false
        },
    },
    computed: {
        ...mapGetters(['role']),
    },
})
</script>
