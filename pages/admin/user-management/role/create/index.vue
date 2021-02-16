<template>
  <card access-name="role">
    <role v-if="ready" url="create" @submit="send" />

    <b-overlay no-wrap :show="overlay" />
  </card>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    data: () => ({
        ready: false,
        overlay: false,
    }),
    mounted() {
        if (this.access['role.create']) this.ready = true
        else this.$router.push('/404')
    },
    methods: {
        async send(data: any) {
            this.overlay = true

            await this.$axios
                .post('/admin/role/store', data)
                .then(() => {
                    this.$router.push('/admin/user-management/role')
                })
                .catch((e) => {
                    this.catchErr(e)
                })

            this.overlay = false
        },
    },
    computed: {
        ...mapGetters(['access']),
    },
})
</script>
