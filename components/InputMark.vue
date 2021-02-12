<template>
  <b-card no-body>
    <b-tabs card>
      <b-tab title="Input" active>
        <vue-simplemde v-model="context.model" :configs="config" />
      </b-tab>
      <b-tab title="Result">
        <div v-if="context.model !== ''">
          <markdown :content="context.model" />
        </div>
        <div v-else>
          <h4 class="text-center text-secondary">Input the markdown to check the result</h4>
        </div>
      </b-tab>
    </b-tabs>
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
        menu: ['Input', 'Result'],
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
