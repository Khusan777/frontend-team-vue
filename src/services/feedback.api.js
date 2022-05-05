import { apiClient } from '~/services/apiClient';

const END_POINT = 'client/feedbacks';

/**
 * Send Feedbacks to Employee
 * @param {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const sendFeedback = params => apiClient.post(`${END_POINT}`, params);

export { sendFeedback };
