import Vue from 'vue'

Vue.mixin({
    data: () => ({
        appName: process.env.appName,
        appURL: process.env.appURL,
        urlFE: process.env.urlFE,
        isDev: process.env.appEnv !== 'production',
    }),
    methods: {
        sauce(path: string): string {
            return (this as any).appURL + '/' + path
        },
        catchErr(e) {
            const t = (this as any),
                s = e.response?.status

            if (t.isDev) {
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

                t.toast(h('div', txt), {
                    title: 'Error',
                    variant: 'danger'
                })
            } else t.toast(`Internal Server Error ${t.isDev ? '(Check console)' : ''}`, {
                title: 'Server Error',
                variant: 'danger'
            })
        },
        logForm(form: any) {
            for (var pair of form.entries())
                console.log(pair[0], pair[1])
        },
        toast(txt: any, obj: any) {
            (this as any).$bvToast.toast(txt, {
                ...obj,
                title: obj?.title ?? 'Success',
                variant: obj?.variant ?? 'success',
                toaster: obj?.toaster ?? 'b-toaster-bottom-center'
            })
        }
    }
})
