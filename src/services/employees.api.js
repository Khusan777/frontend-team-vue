import { apiClient } from '~/services/apiClient';

const END_POINT = 'client/employee';
const END_POINT2 = 'client/employee/responsibilities';
const END_POINT3 = 'client/employee/out-bot-cases';

/**
 * Get AllEmployees data
 * @returns { Promise<AxiosResponse<any>> }
 */
const getEmployee = () => apiClient.get(`${END_POINT}`);

/**
 * Get AllEmployees OUTBOT data
 * @returns { Promise<AxiosResponse<any>> }
 */
const getEmployeeOutBot = params => apiClient.get(`${END_POINT3}`, { params });

/**
 * Get AllEmployees data
 * @returns { Promise<AxiosResponse<any>> }
 */
const getEmployeeById = employeeId => apiClient.get(`client/manager/employees/${employeeId}`);

/**
 * Get Employee Rating-Chart-Data
 * @param {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getRatingChartData = (employeeId, params) =>
  apiClient.get(`client/employees/${employeeId}/rating-chart-data`, { params });

/**
 * Get team ratings data
 * @param {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getTeamRatings = params => apiClient.get('client/manager/employees/ratings', { params });

/**
 * Get Employee ratings data
 * @param {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const getRatings = (employeeId, params) => apiClient.get(`client/employees/${employeeId}/rating-history`, { params });

/**
 * Get Employee Responsibilities
 * @returns { Promise<AxiosResponse<any>> }
 */
const getEmployeeResponsibilities = () => apiClient.get(`${END_POINT2}`);

/**
 * set score to employee
 * @param {Object} params
 * @returns { Promise<AxiosResponse<any>> }
 */
const setScore = params => apiClient.post('client/ratings', params);

/**
 * get Employee Vacations
 * @returns { Promise<AxiosResponse<any>> }
 */
const employeeVacations = () => apiClient.get('client/vacations');

/**
 * get Employee AdditionalDayOffs
 * @returns { Promise<AxiosResponse<any>> }
 */
const employeeAdditionalDayOffs = () => apiClient.get('client/additional_day_offs/employee');

export {
  getEmployee,
  getEmployeeById,
  getRatingChartData,
  getRatings,
  getTeamRatings,
  setScore,
  getEmployeeResponsibilities,
  getEmployeeOutBot,
  employeeVacations,
  employeeAdditionalDayOffs,
};
