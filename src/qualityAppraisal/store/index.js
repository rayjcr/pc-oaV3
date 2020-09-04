import Vue from 'vue'
import Vuex from 'vuex'

import qualityStore from './modules/index';

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: { qualityStore }
})

// document.addEventListener('click', evnt => store.commit('setEvent', evnt))
// window.addEventListener('resize', evnt => store.commit('setEvent', evnt))

export default store
