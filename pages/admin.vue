<template>
  <b-container>
    <header>
      <b-row class="align-items-center">
        <b-col cols="12">
          <h3 class="uppercase">{{ bread[bread.length - 1].name }}</h3>

          <b-breadcrumb>
            <b-breadcrumb-item v-for="(i, k) in bread" :key="k" :active="k + 1 === bread.length">
              <span v-if="k + 1 === bread.length">
                <strong class="underline">{{ i.name }}</strong>
              </span>
              <span v-else>
                <nuxt-link class="text-blue" :to="i.to">{{ i.name }}</nuxt-link>
              </span>
            </b-breadcrumb-item>
          </b-breadcrumb>
        </b-col>
      </b-row>
    </header>

    <div class="h-app">
      <transition name="fade" mode="out-in">
        <nuxt-child />
      </transition>
    </div>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    computed: {
        bread() {
            let to = '',
                path = this.$route.path.split('/')

            path.shift()

            return path.map((i) => {
                to += '/' + i

                return { name: i.replace(/-/g, ' '), to }
            })
        },
    },
})
</script>
