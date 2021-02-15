import Vue, { VNode } from 'vue'

declare module 'vue/types/vue' {
    interface Vue {
        appName: string,
        appURL: string,
        urlFE: string,
        isDev: boolean,
        sauce(path: string): string
        catchErr(e: any): void
        logForm(pair: FormData): void
        toast(txt: string | VNode, obj?: { title?: string, variant?: string, toaster?: string }): void
    }
}

Vue.mixin({
    data: () => ({
        appName: process.env.appName,
        appURL: process.env.appURL,
        urlFE: process.env.urlFE,
        isDev: process.env.appEnv !== 'production',
    }),
    methods: {
        sauce(path: string): string {
            return this.appURL + '/' + path
        },
        catchErr(e: any): void {
            const s = e.response?.status

            if (this.isDev) {
                console.log('--- Client side error ---', e)
                console.log('--- Server side error ---', e.response ?? 'No error found')
            }

            if (s >= 400 && s < 500) {
                const h = this.$createElement,
                    d = e.response.data
                let txt: any = []

                if (typeof d === 'string')
                    txt.push(h('p', d))
                else
                    Object.values(e.response.data).forEach((o: any) => txt.push(h('p', o)))

                this.toast(h('div', txt), {
                    title: 'Error',
                    variant: 'danger'
                })
            } else this.toast(`Internal Server Error ${this.isDev ? '(Check console)' : ''}`, {
                title: 'Server Error',
                variant: 'danger'
            })
        },
        logForm(form: any): void {
            for (var pair of form.entries())
                console.log(pair[0], pair[1], typeof pair[1])
        },
        toast(txt: string | VNode, obj = {
            title: 'Success',
            variant: 'success',
            toaster: 'b-toaster-bottom-center'
        }): void {
            this.$bvToast.toast(txt, {
                ...obj,
            })
        }
    }
})
