import { apiClient } from '~/services/apiClient';

const END_POINT = 'client/activity-records';

const getEmployeeActivity = () => apiClient.get(`${END_POINT}/rating-chart-data`);

/**
 * Get Employee Activity in a certain period of date
 * @param {Object} params
 * @returns { Promise<AxiosResponse<any>> }
 */
const getEmployeeActivityRecordsByParams = params => apiClient.get(`${END_POINT}`, { params });

/**
 * Get Employee Activity Employee
 * @returns { Promise<AxiosResponse<any>> }
 */
const getEmployeeActivityRecords = () => apiClient.get(`${END_POINT}`);

export { getEmployeeActivity, getEmployeeActivityRecords, getEmployeeActivityRecordsByParams };
