<template>
  <div v-if="Object.keys(access).length > 0">
    <div v-for="(i, k) in menu" :key="k" class="list-style-none m-0-10">
      <li v-if="i.children && checkChildPerm(i.children)" class="nav-item">
        <a class="nav-link" href="#" v-b-toggle="'app-sidebar-' + k" @click.prevent>
          <icon-txt :icon="i.icon">
            {{ i.name }}
            <span class="float-right side-icon" :class="toggle[k] ? 'rotate-180' : ''">
              <fa icon="chevron-down" />
            </span>
          </icon-txt>
        </a>

        <b-collapse :id="'app-sidebar-' + k" v-model="toggle[k]">
          <ul class="list-style-none">
            <li
              v-for="(j, kk) in i.children"
              :key="kk"
              :class="checkPerm(j.name) ? 'nav-item' : 'd-none'"
            >
              <nuxt-link v-if="checkPerm(j.name)" class="nav-link" :to="'/admin' + i.link + j.link">
                <icon-txt :icon="j.icon">{{ j.name }}</icon-txt>
              </nuxt-link>
            </li>
          </ul>
        </b-collapse>
      </li>
      <li v-else-if="checkPerm(i.name)" class="nav-item">
        <nuxt-link class="nav-link" :to="'/admin' + i.link">
          <icon-txt :icon="i.icon">{{ i.name }}</icon-txt>
        </nuxt-link>
      </li>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    data: () => {
        const menu = [
            { name: 'Homepage', link: '', icon: 'home' },
            {
                name: 'Profile',
                link: '/profile',
                icon: 'school',
                children: [
                    {
                        name: 'Public Profile',
                        link: '/public-profile',
                        icon: 'university',
                    },
                    {
                        name: 'Vision Mission',
                        link: '/vision-mission',
                        icon: 'tasks',
                    },
                    {
                        name: 'Student Council',
                        link: '/student-council',
                        icon: 'user-graduate',
                    },
                    {
                        name: 'Extracurricular',
                        link: '/extracurricular',
                        icon: 'dice',
                    },
                ],
            },
            {
                name: 'Study Program',
                link: '/study-program',
                icon: 'graduation-cap',
            },
            {
                name: 'Information Media',
                link: '/information-media',
                icon: 'compact-disc',
                children: [
                    { name: 'Agenda', link: '/agenda', icon: 'calendar-week' },
                    { name: 'Prestation', link: '/prestation', icon: 'medal' },
                    { name: 'Gallery', link: '/gallery', icon: 'photo-video' },
                ],
            },
            { name: 'Employees', link: '/employees', icon: 'portrait' },
            {
                name: 'User Management',
                link: '/user-management',
                icon: 'users-cog',
                children: [
                    { name: 'Users', link: '/users', icon: 'users' },
                    { name: 'Role', link: '/role', icon: 'tags' },
                ],
            },
            { name: 'Settings', link: '/settings', icon: 'cog' },
            { name: 'Audits', link: '/audits', icon: 'clipboard-list' },
        ]

        return {
            menu,
            toggle: menu.map(() => false),
        }
    },
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
                          f.includes(this.toKebab(arr[i].name))
                      )
                    : []

                if (a.length && this.access[a[0]]) b.push(a.length)
            }

            return b.length > 0
        },
    },
    computed: {
        ...mapGetters(['access']),
    },
})
</script>
