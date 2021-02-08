<template>
  <b-card>
    <template #header>
      <b-nav card-header tabs>
        <b-nav-item
          v-for="(i, k) in menu"
          :key="k"
          :active="active === k"
          @click="active = k"
        >{{ i }}</b-nav-item>
      </b-nav>
    </template>

    <b-card-body>
      <div v-if="active === 0">
        <div v-if="context.model !== ''">
          <markdown :content="context.model" />
        </div>
        <div v-else>
          <h4 class="text-center text-secondary">Input the markdown to check the result</h4>
        </div>
      </div>
      <div v-else>
        <vue-simplemde v-model="context.model" :configs="config" />
      </div>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: {
        context: {
            type: Object,
            required: true,
        },
    },
    data: () => ({
        menu: [],
        active: 0,
        config: {
            indentWithTabs: false,
            spellChecker: false,
            tabSize: 4,
            toolbar: [
                'heading',
                'bold',
                'italic',
                'strikethrough',
                '|',
                'quote',
                'unordered-list',
                'ordered-list',
                '|',
                'link',
                'image',
                '|',
                'table',
            ],
        },
    }),
    computed: {
        model() {
            return (this as any).context.model
        },
    },
})
</script>
