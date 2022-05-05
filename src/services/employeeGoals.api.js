import { apiClient } from '~/services/apiClient';

const END_POINT = 'client/targets';
const END_POINT2 = 'client/targets/store';

/**
 * Get Employee goals data
 * @param {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getGoals = params => apiClient.get(`${END_POINT}`, { params });

const sendTargetToEmployee = params => apiClient.post(`${END_POINT2}`, params);

export { getGoals, sendTargetToEmployee };
