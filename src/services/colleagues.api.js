import { apiClient } from '~/services/apiClient';

const END_POINT = 'client/colleagues';

/**
 * Get AllColleagues data
 * @params {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getAllColleagues = params => apiClient.get(`${END_POINT}`, { params });

/**
 * Get Colleague by id data
 * @params {number} id
 * @returns { Promise<AxiosResponse<any>> }
 */
const getColleague = id => apiClient.get(`${END_POINT}/${id}`);

/**
 * Get AllColleagues birthday data
 * @returns { Promise<AxiosResponse<any>> }
 */
const getColleaguesBirthDay = () => apiClient.get(`${END_POINT}/bdays`);

export { getAllColleagues, getColleague, getColleaguesBirthDay };
