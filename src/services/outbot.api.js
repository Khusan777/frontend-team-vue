import { apiClient } from '~/services/apiClient';

const END_POINT = 'client/out-bot';

/**
 * Get OutbotMessagesFromAllColleagues data
 * @param {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getOutbotMessagesFromAllColleagues = params => apiClient.get(END_POINT, { params });

/**
 * Get OutbotMessagesColleague data
 * @param {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getOutbotMessagesFromColleague = params => apiClient.get(END_POINT, { params });

export { getOutbotMessagesFromAllColleagues, getOutbotMessagesFromColleague };
