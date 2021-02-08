<template>
  <b-container class="my-4 py-4">
    <b-row class="justify-content-center">
      <b-col xs="12" sm="12" md="9" lg="5">
        <b-card title="Login">
          <b-card-body>
            <formulate-form @submit="send()">
              <formulate-input
                label="Email"
                type="email"
                v-model="form.email"
                validation="required|email"
              />
              <formulate-input
                label="Password"
                type="password"
                v-model="form.password"
                validation="required"
              />
              <recaptcha
                ref="reeee"
                class="mb-2"
                @verify="onVerify"
                :sitekey="key"
                :loadRecaptchaScript="true"
              />
              <formulate-input label="Login" type="submit" :disabled="clicked">
                <b-spinner v-if="clicked" variant="primary" small />
              </formulate-input>
            </formulate-form>
          </b-card-body>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    auth: 'guest',
    data: () => ({
        form: {
            email: '',
            password: '',
            recaptcha: null,
        },
        clicked: false,
        key: process.env.key,
    }),
    methods: {
        async send() {
            const _this = this as any

            this.clicked = true

            await this.$auth
                .loginWith('local', { data: this.form })
                .then(async ({ data }: any) => {
                    // _this.$refs.reeee.reset()
                    // this.clicked = false
                    await this.$auth.setUserToken(data.token)

                    this.$router.push('/admin')
                })
                .catch((e) => {
                    _this.catchErr(e)

                    _this.$refs.reeee.reset()
                    this.clicked = false
                })
        },
        onVerify(resp: any) {
            this.form.recaptcha = resp
        },
    },
})
</script>
