import { apiClient } from '~/services/apiClient';

const END_POINT = 'client/employee/settings/outbot-acceess';

/**
 * get OutbotAcceess to Colleagues data
 * @param {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const outbotAcceess = (param) => apiClient.get(`${END_POINT}/viewable`,param);

/**
 * set OutbotAcceess to Colleagues data
 * @param {Object} params
 * @returns { Promise<AxiosResponse<any>> }
 */
const setOutbotAcceess = params => apiClient.post(`${END_POINT}`, params);

/**
 * delete OutbotAcceess to Colleagues data
 * @param {Object} params
 * @returns { Promise<AxiosResponse<any>> }
 */
const deleteOutbotAcceess = employeeId => apiClient.delete(`${END_POINT}/${employeeId}`);

export { outbotAcceess, setOutbotAcceess, deleteOutbotAcceess };
