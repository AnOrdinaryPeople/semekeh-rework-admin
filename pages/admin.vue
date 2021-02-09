<template>
  <b-container>
    <header>
      <b-row class="align-items-center">
        <b-col cols="12">
          <h3 class="uppercase">{{ bread[bread.length - 1].name }}</h3>

          <b-breadcrumb>
            <b-breadcrumb-item v-for="(i, k) in bread" :key="k" :active="k + 1 === bread.length">
              <span v-if="k + 1 === bread.length">
                <strong class="text-decoration-underline">{{ i.name }}</strong>
              </span>
              <span v-else>
                <nuxt-link class="text-white" :to="i.to">{{ i.name }}</nuxt-link>
              </span>
            </b-breadcrumb-item>
          </b-breadcrumb>
        </b-col>
      </b-row>
    </header>

    <div class="h-app">
      <nuxt-child />
    </div>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    computed: {
        bread() {
            let obj: any = [],
                path = this.$route.path.split('/')

            path.shift()

            path.reduce((a: any, b, c) => {
                obj.push({
                    name: b.replace(/-/g, ' '),
                    to: a[c - 1]
                        ? `/${a[c - 1].name.replace(/\s+/g, '-')}/${b}`
                        : '/' + b,
                })

                return obj
            }, [])

            return obj
        },
    },
})
</script>
