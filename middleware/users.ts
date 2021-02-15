import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({ redirect }) => {
    return redirect('/admin/user-management/users')
}

export default middleware
