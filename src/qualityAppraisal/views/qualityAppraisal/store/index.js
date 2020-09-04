const qualityStore = {
    state: {
        isInspireCard:false,
    },
    mutations: {
        SET_isInspireCard: (state, type) => {
            state.isInspireCard = type
        },
    },
    actions: {
        set_isInspireCard: ({ commit }, val) => {
            commit('SET_isInspireCard', val)
        },
    }
  };
  export default qualityStore;