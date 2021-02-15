import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({ redirect }) => {
    return redirect('/admin/information-media/agenda')
}

export default middleware
