import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
    access: {},
    role: '',
    study: {}
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
    access: s => s.access,
    role: s => s.role,
    study: s => s.study
}

export const actions: ActionTree<RootState, RootState> = {
    setAccess({ commit }, data) {
        const a = localStorage.getItem('app')

        if (a) {
            const b = JSON.parse(atob(a))

            commit('SET_ACCESS', b.access)
            commit('SET_ROLE', b.role)
        } else {
            localStorage.setItem('app', btoa(JSON.stringify({
                access: data.access,
                role: data.role
            })))

            commit('SET_ACCESS', data.access)
            commit('SET_ROLE', data.role)
        }
    },
    setStudy({ commit }, data) {
        commit('SET_STUDY', data)
    }
}

export const mutations: MutationTree<RootState> = {
    SET_ACCESS: (s, data: any) => s.access = data,
    SET_ROLE: (s, data: string) => s.role = data,
    SET_STUDY: (s, data) => s.study = data
}
