<template>
  <b-container class="my-4 py-4">
    <b-row class="justify-content-center">
      <b-col sm="12" md="9" lg="5">
        <b-card class="h-login" title="Login">
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
                class="mb-2 h-recap"
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

<style scoped>
.h-login {
    min-height: 460px;
}
.h-recap {
    min-height: 80px;
}
</style>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    middleware: 'guest',
    // auth: 'guest',
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
            this.clicked = true

            await this.$auth
                .loginWith('local', { data: this.form })
                .then(async ({ data }: any) => {
                    await this.$auth.setUserToken(data.token)

                    this.$store.dispatch(
                        'setAccess',
                        JSON.parse(atob(data.token.split('.')[1]))
                    )

                    this.$router.push('/admin')
                })
                .catch((e) => {
                    this.catchErr(e)
                    ;(this as any).$refs.reeee.reset()
                    this.clicked = false
                })
        },
        onVerify(resp: any) {
            this.form.recaptcha = resp
        },
    },
})
</script>
