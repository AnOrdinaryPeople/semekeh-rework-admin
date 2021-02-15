import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({ redirect }) => {
    return redirect('/admin/profile/public-profile')
}

export default middleware
