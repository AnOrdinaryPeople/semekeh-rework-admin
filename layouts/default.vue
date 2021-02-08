<template>
  <div>
    <b-sidebar v-if="$auth.loggedIn" id="app-sidebar" backdrop right>
      <app-sidebar />

      <template #footer="{ hide }">
        <div class="text-center p-3">
          <a class="text-bpi-blue text-decoration-none" href="#" @click.prevent="logout(hide)">
            <strong>Logout</strong>
          </a>
        </div>
      </template>
    </b-sidebar>

    <transition name="fade" mode="out-in">
      <Nuxt />
    </transition>

    <div class="m-2 px-2 text-right">
      <strong>Copyright &copy; {{ new Date().getFullYear() + ' - ' + appName }}</strong>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

import Sidebar from './Sidebar.vue'

export default Vue.extend({
    components: {
        appSidebar: Sidebar,
    },
    methods: {
        logout(hide: any) {
            hide()

            this.$auth.logout()
        },
    },
})
</script>
