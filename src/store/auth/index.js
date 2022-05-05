import { getUser, logout } from '~/services/auth.api';
import VueCookie from 'vue-cookie';

const state = {
  user: undefined,
};

const actions = {
  getUser: async ({ commit }) => {
    await getUser().then(response => {
      commit('SET_USER', response.data);
    });
  },
  logout: async ({ commit }) => {
    await logout().then(() => {
      commit('CLEAR_USER');
    });
  },
};

const mutations = {
  SET_USER: (state, user) => {
    state.user = user;
  },
  CLEAR_USER: state => {
    state.user = undefined;
    VueCookie.delete('auth');
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
