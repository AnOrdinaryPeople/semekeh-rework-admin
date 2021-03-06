import Vue from 'vue'
import VueShowdown from 'vue-showdown'

const obj: any = {
    ul: 'fa-ul',
    table: 'table table-striped table-responsive',
    img: 'img-fluid',
    blockquote: 'bpi-blockquote',
    h1: 'pb-3 mb-3 border-bottom text-primary',
    h2: 'pb-2 mb-2 border-bottom text-primary',
    h3: 'text-primary',
    h4: 'text-primary',
    h5: 'text-primary',
    h6: 'text-primary',
}

VueShowdown.showdown.extension('result', () => [
    ...Object.keys(obj).map((val: string) => ({
        type: 'output',
        regex: new RegExp(`<${val}(.*)>`, 'g'),
        replace: `<${val} class="${obj[val]}" $1>`
    })),
    {
        type: "output",
        regex: /<li>/gi,
        replace:
            '<li class="mb-2"><span class="fa-li text-bpi-yellow"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="dot-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-dot-circle fa-w-16"><path fill="currentColor" d="M256 56c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m0-48C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 168c-44.183 0-80 35.817-80 80s35.817 80 80 80 80-35.817 80-80-35.817-80-80-80z" class=""></path></svg></span>',
    },
    {
        type: "output",
        regex: /<a(.*)>/g,
        replace: '<a target="_blank" rel="noopener" class="text-blue" $1>',
    },
])

Vue.use(VueShowdown, { flavor: 'github' })
