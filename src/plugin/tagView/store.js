const state = {
    visitedViews: [],
    cachedViews: []
};
const mutations = {
    // 如果没在访问中则把 当前路由 加入缓存中
    ADD_VISITED_VIEW: (state, view) => {
        if (state.visitedViews.some((v) => v.name === view.name)) {
            return;
        }
        state.visitedViews.push(
            Object.assign({}, view, {
                title: view.meta.title || 'no-name'
            })
        );
    },
    // 如果没在缓存中则把 当前路由 加入缓存中 这里要和组件的 name 保持一直 不然 kepp-alive 不会生效
    ADD_CACHED_VIEW: (state, view) => {
        if (state.cachedViews.includes(view.name)) {
            return;
        }
        if (!view.meta.noCache) {
            state.cachedViews.push(view.name);
        }
    },
    // 删除该 访问 路由
    DEL_VISITED_VIEW: (state, view) => {
        const index = state.visitedViews.findIndex((v) => v.name === view.name);
        index > -1 && state.visitedViews.splice(index, 1);
    },
    //   删除 缓存 路由
    DEL_CACHED_VIEW: (state, view) => {
        const index = state.cachedViews.indexOf(view.name);
        index > -1 && state.cachedViews.splice(index, 1);
    },
    // 删除 除了当前路由的其他访问路由 affix => 固定的不能删除的
    DEL_OTHERS_VISITED_VIEWS: (state, view) => {
        state.visitedViews = state.visitedViews.filter((v) => {
            return v.meta.affix || v.name === view.name;
        });
    },
    // 删除 除了当前路由的其他访问路由 affix => 固定的不能删除的
    DEL_OTHERS_CACHED_VIEWS: (state, view) => {
        const index = state.cachedViews.indexOf(view.name);
        if (index > -1) {
            state.cachedViews = state.cachedViews.slice(index, index + 1);
        } else {
            state.cachedViews = [];
        }
    },
    //  删除所有路由 除了固定的路由
    DEL_ALL_VISITED_VIEWS: (state) => {
        // keep affix tags
        const affixTags = state.visitedViews.filter((tag) => tag.meta.affix);
        state.visitedViews = affixTags;
    },
    DEL_ALL_CACHED_VIEWS: (state) => {
        state.cachedViews = [];
    },
    UPDATE_VISITED_VIEW: (state, view) => {
        for (let v of state.visitedViews) {
            if (v.name === view.name) {
                v = Object.assign(v, view);
                break;
            }
        }
    }
};

const actions = {
    // 点击路由的时候 同时 添加 访问和缓存
    addView({ dispatch }, view) {
        dispatch('addVisitedView', view);
        dispatch('addCachedView', view);
    },
    addVisitedView({ commit }, view) {
        commit('ADD_VISITED_VIEW', view);
    },
    addCachedView({ commit }, view) {
        commit('ADD_CACHED_VIEW', view);
    },

    delView({ dispatch, state }, view) {
        return new Promise((resolve) => {
            dispatch('delVisitedView', view);
            dispatch('delCachedView', view);
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            });
        });
    },
    delVisitedView({ commit, state }, view) {
        return new Promise((resolve) => {
            commit('DEL_VISITED_VIEW', view);
            resolve([...state.visitedViews]);
        });
    },
    delCachedView({ commit, state }, view) {
        return new Promise((resolve) => {
            commit('DEL_CACHED_VIEW', view);
            resolve([...state.cachedViews]);
        });
    },

    delOthersViews({ dispatch, state }, view) {
        return new Promise((resolve) => {
            dispatch('delOthersVisitedViews', view);
            dispatch('delOthersCachedViews', view);
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            });
        });
    },
    delOthersVisitedViews({ commit, state }, view) {
        return new Promise((resolve) => {
            commit('DEL_OTHERS_VISITED_VIEWS', view);
            resolve([...state.visitedViews]);
        });
    },
    delOthersCachedViews({ commit, state }, view) {
        return new Promise((resolve) => {
            commit('DEL_OTHERS_CACHED_VIEWS', view);
            resolve([...state.cachedViews]);
        });
    },

    delAllViews({ dispatch, state }, view) {
        return new Promise((resolve) => {
            dispatch('delAllVisitedViews', view);
            dispatch('delAllCachedViews', view);
            resolve({
                visitedViews: [...state.visitedViews],
                cachedViews: [...state.cachedViews]
            });
        });
    },
    delAllVisitedViews({ commit, state }) {
        return new Promise((resolve) => {
            commit('DEL_ALL_VISITED_VIEWS');
            resolve([...state.visitedViews]);
        });
    },
    delAllCachedViews({ commit, state }) {
        return new Promise((resolve) => {
            commit('DEL_ALL_CACHED_VIEWS');
            resolve([...state.cachedViews]);
        });
    },
    updateVisitedView({ commit }, view) {
        commit('UPDATE_VISITED_VIEW', view);
    }
};
export default {
    namespaced: true,
    state,
    mutations,
    actions
};
