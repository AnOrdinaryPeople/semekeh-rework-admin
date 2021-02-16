<template>
  <div>
    <card access-name="role">
      <nuxt-link
        v-if="access['role.create']"
        class="btn btn-primary mb-4"
        to="/admin/user-management/role/create"
      >Create</nuxt-link>

      <data-table type="role" :table="table" :edit="edit" :del="del" />
    </card>

    <b-modal
      id="del"
      title="Delete"
      header-bg-variant="danger"
      header-text-variant="light"
      hide-footer
    >
      <p>
        Are you sure want to
        <strong>delete</strong> this data? This action
        <strong>cannot</strong> be undone
      </p>
      <b-btn class="btn btn-danger" :disabled="clicked" @click="destroy()">Yes</b-btn>
      <a href="#" class="btn btn-secondary" @click.prevent="$bvModal.hide('del')">No</a>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    data: () => ({
        table: {
            fields: [{ key: 'name', sortable: true }, { key: 'action' }],
            items: [],
            busy: true,
        },
        modal: {},
        clicked: false,
    }),
    async fetch() {
        if (this.access['role.show']) await this.render()
        else this.$router.push('/404')
    },
    methods: {
        async render() {
            await this.$axios.get('/admin/role').then((r) => {
                this.table.items = r.data
                this.table.busy = false
            })
        },
        edit(type: string, key: any) {
            this.$router.push('/admin/user-management/role/create/' + key.id)
        },
        del(type: string, key: any) {
            this.modal = key
            this.$bvModal.show('del')
        },
        async destroy() {
            this.clicked = true

            await this.$axios
                .delete('/admin/role/delete/' + (this as any).modal.id)
                .then((r) => {
                    this.table.items = this.table.items.filter(
                        (i: any) => i.id !== (this as any).modal.id
                    )
                    this.$bvModal.hide('del')

                    this.toast(r.data.message)
                })
                .catch((e) => {
                    this.catchErr(e)
                })

            this.clicked = false
        },
    },
    computed: {
        ...mapGetters(['access']),
    },
})
</script>
