import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
    access: {}
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
    access: s => s.access
}

export const actions: ActionTree<RootState, RootState> = {
    setAccess({ commit }, data) {
        const a = localStorage.getItem('app')

        if (a)
            commit('SET_ACCESS', JSON.parse(atob(a)))
        else {
            localStorage.setItem('app', btoa(JSON.stringify(data)))

            commit('SET_ACCESS', data)
        }

    }
}

export const mutations: MutationTree<RootState> = {
    SET_ACCESS: (s, data: any) => s.access = data
}
