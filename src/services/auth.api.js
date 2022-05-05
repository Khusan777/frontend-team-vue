import { apiClient, clearCookie } from '~/services/apiClient';
import { app } from '~/main';
import { objCheckType } from '~/utils/computeFunc';
import router from '~/router';
import store from '~/store';

const END_POINT = '/auth';

/**
 * Set authentication setting after login
 * @param {Object} res
 * @param {boolean} rememberMe
 * @returns {*}
 */

const setAuth = (res, rememberMe) => {
  const data = res?.data;
  const accessToken = data?.access_token;
  const tokenType = data?.token_type;
  const expiresIn = data?.expires_in ?? 1;
  const token = tokenType + ' ' + accessToken;

  if (objCheckType(accessToken, 'string') && objCheckType(tokenType, 'string')) {
    const $cookie = app.config.globalProperties?.$cookie;
    if ($cookie) {
      clearCookie().finally(() => {
        $cookie.set('auth', token, {
          expires: rememberMe ? `${expiresIn}s` : '1D',
        });
      });
      apiClient.defaults.headers['Authorization'] = token;
    }
  }
  return res;
};

const getUser = () => apiClient.get(`${END_POINT}/user`, { params: { app: 'Client' } });

/**
 * Set authorization login user
 * @param {Object} params - Request params
 * @param {boolean} rememberMe
 * @returns {Promise<*>}
 */

const login = params =>
  apiClient.post(`${END_POINT}/login-password`, { remember_me: true, ...params }).then(response => {
    setAuth(response, params.remember_me);
    store.dispatch('auth/getUser');
  });

/**
 * Set logout user
 * @returns { Promise<AxiosResponse<any>> }
 */

const logout = () =>
  apiClient.post(`${END_POINT}/logout?app=Client`).then(() => {
    clearCookie().finally(() => {
      delete apiClient.defaults.headers['Authorization'];
      router.push({ name: 'auth' }).finally(() => {});
    });
  });

export { login, logout, getUser };
