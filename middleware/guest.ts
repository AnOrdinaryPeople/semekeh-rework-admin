export default function ({ app, redirect }: any) {
    if (app.$auth.loggedIn)
        return redirect('/admin')
}
