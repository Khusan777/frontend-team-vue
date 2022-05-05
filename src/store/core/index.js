import { getApp } from '~/services/app.api';
import { getEmployee } from '~/services/employees.api';
import { parseErrorsFromResponse } from '~/utils/parsers';

const state = {
  appLoading: false,
  globals: undefined,
  employeeData: {
    data: undefined,
    error: undefined,
    loading: true,
  },
};

const actions = {
  getApp: async ({ commit, state }, params) => {
    state.appLoading = true;
    await getApp(params).then(res => {
      commit('SET_APP', res.data);
    });
  },
  getEmployeeData: async ({ commit }) => {
    commit('SET_EMPLOYEE_LOADING', true);
    await getEmployee()
      .then(response => {
        commit('SET_EMPLOYEE_DATA', response.data);
      })
      .catch(err => commit('SET_ERROR_EMPLOYEE', err))
      .finally(() => commit('SET_EMPLOYEE_LOADING', false));
  },
};

const mutations = {
  SET_APP: (state, app) => {
    state.appLoading = false;
    state.globals = app;
  },
  SET_EMPLOYEE_DATA: (state, user) => {
    state.employeeData.data = user;
  },
  SET_ERROR_EMPLOYEE: (state, user) => {
    state.employeeData.error = parseErrorsFromResponse(user);
  },
  SET_EMPLOYEE_LOADING: (state, loading) => {
    state.employeeData.loading = loading;
  },
};

const getters = {
  positions: state => {
    return state.globals?.positions?.map(item => {
      return { title: item.name, value: item.id };
    });
  },

  departments: state => {
    return state.globals?.departments?.map(item => {
      return { title: item.name, value: item.id };
    });
  },

  teams: state => {
    return state.globals?.teams?.map(item => {
      return { title: item.name, value: item.id };
    });
  },
  getEmployeeData: state => {
    return state.employeeData;
  },
  appLoading: state => {
    return state.appLoading;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
