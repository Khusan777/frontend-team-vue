import { apiClient } from '~/services/apiClient';

const END_POINT = '/client/surveys';

/**
 * Get All Surveys
 * @returns { Promise<AxiosResponse<any>> }
 */
const getIndexSurvey = () => apiClient.get(`${END_POINT}`);

/**
 * Get All Surveys
 * @returns { Promise<AxiosResponse<any>> }
 */
const getShowSurveyQuestions = surveyId => apiClient.get(`${END_POINT}/${surveyId}`);

/**
 * Send Answer to question
 * @param {Object}
 * @returns { Promise<AxiosResponse<any>> }
 */
const sendAnswerQuestion = (surveyId, param) => apiClient.post(`${END_POINT}/${surveyId}/complete`, param);

export { getIndexSurvey, getShowSurveyQuestions, sendAnswerQuestion };
