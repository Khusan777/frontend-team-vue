import { apiClient } from '~/services/apiClient';

const END_POINT = 'client/feedbacks';

/**
 * Get MyFeedbacks to Employee
 * @returns { Promise<AxiosResponse<any>> }
 */
const getFeedbacks = () => apiClient.get(`${END_POINT}`);

/**
 * Get options data employee
 * @returns { Promise<AxiosResponse<any>> }
 */
const getOptionsData = () => apiClient.get(`client/client/options/employee/index`);

/**
 * Get options chart data
 * @returns { Promise<AxiosResponse<any>> }
 */
const getOptionsChartData = () => apiClient.get(`client/client/options/employee/option_chart_data`);

/**
 * Get options total data
 * @returns { Promise<AxiosResponse<any>> }
 */
const getOptionsTotalData = () => apiClient.get(`client/client/options/employee/total`);

export { getFeedbacks, getOptionsData, getOptionsChartData, getOptionsTotalData };
