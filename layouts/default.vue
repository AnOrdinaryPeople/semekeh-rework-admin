<template>
  <div>
    <app-nav v-if="$auth.loggedIn" />

    <b-sidebar v-if="$auth.loggedIn" id="app-sidebar" backdrop right>
      <app-sidebar />

      <template #footer="{ hide }">
        <div class="text-center p-3">
          <a class="text-decoration-none" href="#" @click.prevent="logout(hide)">
            <strong>Logout</strong>
          </a>
        </div>
      </template>
    </b-sidebar>

    <transition name="fade" mode="out-in">
      <Nuxt :class="$auth.loggedIn ? 'mt-5 pt-3' : ''" />
    </transition>

    <div class="mx-2 my-4 px-2 text-right">
      <strong>Copyright &copy; {{ new Date().getFullYear() + ' &mdash; ' + appName }}</strong>
      <small class="text-muted">
        Made with &#x2764; by
        <strong>TIM ICT SMK BPI</strong>
      </small>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Navbar from './Navbar.vue'
import Sidebar from './Sidebar.vue'

export default Vue.extend({
    components: {
        appNav: Navbar,
        appSidebar: Sidebar,
    },
    methods: {
        async logout(hide: any) {
            hide()

            await this.$auth.logout().then(() => {
                localStorage.removeItem('app')
            })
        },
    },
    created() {
        if (this.$auth.loggedIn) this.$store.dispatch('setAccess')
    },
})
</script>
