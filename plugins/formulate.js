// declare module '@braid/vue-formulate' {
//     export function VueFormulate(): void
// }

import Vue from 'vue'
import VueFormulate from '@braid/vue-formulate'
import InputMark from '~/components/InputMark'

Vue.component('input-mark', InputMark)

Vue.use(VueFormulate, {
    classes: {
        outer: ['form-group'],
        input: ['form-control'],
        errors: ['list-style-none', 'pl-0'],
        error: ['form-text', 'small', 'text-danger'],
        help: ['form-text', 'small'],
        labelHasErrors: 'text-danger',
        inputHasErrors: 'is-invalid'
    },
    library: {
        markdown: {
            classification: 'text',
            component: 'input-mark'
        }
    }
})
