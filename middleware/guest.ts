import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({ app, redirect }) => {
    if (app.$auth.loggedIn)
        return redirect('/admin')
}

export default middleware
