<template>
  <div>
    <b-row class="mb-2">
      <b-col cols="3">
        <b-form-input v-if="search" v-model="filter" type="search" placeholder="Search.." />
      </b-col>
      <b-col cols="9">
        <div class="float-right">
          <b-input-group prepend="Show" append="data">
            <b-form-select v-model="perPage" :options="opt" />
          </b-input-group>
        </div>
      </b-col>
    </b-row>

    <b-table
      :id="'table-' + type"
      responsive
      striped
      show-empty
      :fields="table.fields"
      :items="table.items"
      :filter="filter"
      :busy="busy"
      :per-page="perPage"
      :current-page="currentPage"
      @filtered="onFiltered"
    >
      <template #cell(thumbnail)="data">
        <b-img :src="sauce('storage/' + data.item.thumbnail)" style="max-width: 175px" />
      </template>
      <template #cell(url)="data">
        <b-img :src="sauce('storage/' + data.item.url)" style="max-width: 175px" />
      </template>
      <template #cell(link)="data">
        <a :href="data.item.link" target="_blank">{{ data.item.link }}</a>
      </template>
      <template #cell(icon)="data">
        <fa :icon="['fab', data.item.icon]" />
        <span class="pl-2">{{ '&nbsp;' + data.item.icon }}</span>
      </template>
      <template v-if="checkAccess" #cell(action)="data">
        <a
          v-if="access[`${type}.show`] && show"
          class="btn btn-info btn-sm"
          href="#"
          v-b-tooltip.hover
          title="Detail"
          @click.prevent="show(type, data.item)"
        >
          <fa icon="eye" />
        </a>
        <a
          v-if="access[`${type}.update`] && edit"
          class="btn btn-primary btn-sm"
          href="#"
          v-b-tooltip.hover
          title="Edit"
          @click.prevent="edit(type, data.item)"
        >
          <fa icon="edit" />
        </a>
        <a
          v-if="access[`${type}.delete`] && del"
          class="btn btn-danger btn-sm"
          href="#"
          v-b-tooltip.hover
          title="Delete"
          @click.prevent="del(type, data.item)"
        >
          <fa icon="trash" />
        </a>
        <a
          v-if="access[`${type}.delete`] && dell && data.item.id !== 1"
          class="btn btn-danger btn-sm"
          href="#"
          v-b-tooltip.hover
          title="Delete"
          @click.prevent="dell(type, data.item)"
        >
          <fa icon="trash" />
        </a>
        <a
          v-if="access[type + '.delete'] && delEmp && data.item.child_type !== 1 && data.item.child_type !== 2"
          class="btn btn-danger btn-sm"
          href="#"
          v-b-tooltip.hover
          title="Delete"
          @click.prevent="delEmp(type, data.item)"
        >
          <fa icon="trash" />
        </a>
        <slot :cell="data.item" />
      </template>
      <template #table-busy>
        <div class="text-center my-2">
          <b-spinner class="align-middle" />
          <strong>Loading...</strong>
        </div>
      </template>
      <template #empty>
        <div class="text-center my-2">
          <span>Empty data</span>
        </div>
      </template>
      <template #emptyfiltered>
        <div class="text-center my-2">
          <span>{{ filter }} Not found</span>
        </div>
      </template>
    </b-table>

    <b-row class="mt-2">
      <b-col cols="6">
        <b-pagination
          :aria-controls="'table-' + type"
          v-model="currentPage"
          :per-page="perPage"
          :total-rows="total"
        />
      </b-col>
      <b-col cols="6" class="text-right">
        <span>Showed {{ currentTotal }} from {{ table.items.length }} data</span>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'

export default Vue.extend({
    props: {
        table: {
            required: true,
            type: Object,
        },
        show: Function,
        edit: Function,
        del: Function,
        dell: Function,
        delEmp: Function,
        type: {
            required: true,
            type: String,
        },
        search: {
            default: true,
            type: Boolean,
        },
    },
    data: () => ({
        currentPage: 1,
        filter: '',
        totalItem: 0,
        perPage: 10,
        opt: [
            { value: 10, text: 10 },
            { value: 25, text: 25 },
            { value: 50, text: 50 },
            { value: 100, text: 100 },
        ],
    }),
    methods: {
        onFiltered(filteredItems: any) {
            this.totalItem = filteredItems.length
            this.currentPage = 1
        },
    },
    computed: {
        ...mapGetters(['access']),
        total() {
            return this.totalItem || this.table.items.length
        },
        currentTotal() {
            return this.totalItem === 0 || this.totalItem > this.perPage
                ? this.table.items.slice(
                      (this.currentPage - 1) * this.perPage,
                      this.currentPage * this.perPage
                  ).length
                : this.totalItem
        },
        busy() {
            return this.table.busy ?? false
        },
        checkAccess() {
            const a = this.access,
                t = this.type

            return a[t + '.show'] || a[t + '.update'] || a[t + '.delete']
        },
    },
})
</script>
