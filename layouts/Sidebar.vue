<template>
  <div v-if="access.length" class="list-style-none">
    <div v-for="(i, k) in menu" :key="k">
      <div v-if="i.children && checkChildPerm(i.children)">
        <b-nav-item v-b-toggle="'app-sidebar-' + k">
          {{ i.name }}
          <span class="float-right">
            <fa icon="chevron-down" />
          </span>
        </b-nav-item>
        <b-collapse :id="'app-sidebar-' + k" class="pl-4">
          <div v-for="(j, kk) in i.children" :key="kk">
            <b-nav-item v-if="checkPerm(j.name)" :to="'/admin' + i.link + j.link">
              <fa v-if="j.icon" class="mr-1" :icon="j.icon" />
              {{ j.name }}
            </b-nav-item>
          </div>
        </b-collapse>
      </div>
      <div v-else>
        <b-nav-item v-if="checkPerm(i.name)" :to="'/admin' + i.link">
          <fa v-if="i.icon" class="mr-1" :icon="i.icon" />
          {{ i.name }}
        </b-nav-item>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    data: () => ({
        menu: [
            { name: 'Homepage', link: '/homepage' },
            {
                name: 'Profile',
                link: '/profile',
                children: [
                    { name: 'Public Profile', link: '/public-profile' },
                    { name: 'Vision Mission', link: '/vision-mission' },
                    { name: 'Student Council', link: '/student-council' },
                    { name: 'Extracurricular', link: '/extracurricular' },
                ],
            },
            { name: 'Study Program', link: '/study-program' },
            {
                name: 'Information Media',
                link: '/information-media',
                children: [
                    { name: 'Agenda', link: '/agenda' },
                    { name: 'Prestation', link: '/prestation' },
                    { name: 'Gallery', link: '/gallery' },
                ],
            },
            { name: 'Employees', link: '/employees' },
            {
                name: 'User Management',
                link: '/user-management',
                children: [
                    { name: 'Users', link: '/users' },
                    { name: 'Role', link: '/role' },
                ],
            },
            { name: 'Audits', link: '/audits' },
        ],
    }),
    methods: {
        toKebab(str: string): string {
            return str.replace(/\s+/g, '-').toLowerCase()
        },
        checkPerm(str: string): boolean {
            const a = Object.keys(this.access).filter((f: any) =>
                f.includes(this.toKebab(str))
            )

            return a.length
                ? (this.access[a[0]] === 1 || this.access[a[0]] === true) ??
                      false
                : false
        },
        checkChildPerm(arr: any): boolean {
            let a: any,
                b: any = []

            for (let i in arr) {
                a = arr[i].name
                    ? Object.keys(this.access).filter((f: any) =>
                          f.includes(arr[i].name)
                      )
                    : []

                if (a.length && this.access[a[0]]) b.push(a.length)
            }

            return b.length > 0
        },
    },
    computed: {
        access(): any {
            return this.$auth.user?.access ?? []
        },
    },
})
</script>
