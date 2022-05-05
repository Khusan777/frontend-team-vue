import { apiClient } from '~/services/apiClient';

const END_POINT = 'client/client/salaries';

/**
 * Get Salaries Employee
 * @returns { Promise<AxiosResponse<any>> }
 */
const getSalaries = () => apiClient.get(`${END_POINT}`);

export { getSalaries };
