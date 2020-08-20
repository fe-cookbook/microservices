import { ErrorBoundary, get, post } from '../core/axios';
import { getBaseURL } from '../config'

const tusdaoUrl = `/user/tusdao_control`
const API = {
  // 用户
  login: `${tusdaoUrl}/login/login`,
  register: `${tusdaoUrl}/login/register`,
  loginOut: `${tusdaoUrl}/login/logout`,
  getBySystemId: `/tbs/system/getBySystemId`,
  getButtons: `${tusdaoUrl}/resource/getUserButtons`,

}


/**
 * @name 获取按钮权限列表
 * @param { number } menuId 菜单Id
 */
export function getButtonList(menuId) {
  console.info(`${getBaseURL()}${API.getButtons}`)
  return ErrorBoundary(get(`${getBaseURL()}${API.getButtons}`, { params: { menuId } }));
}


/**
 * 获取系统字典
 * @param {*} params
 */
export function getBySystemId(params) {
  return ErrorBoundary(get(`${getBaseURL()}${API.getBySystemId}`, { params }))
}

/**
 * 请求字典数据
 * @date 2020-07-21
 * @returns {any}
 */
export async function checkDic(systemId = 'tusdao-tbs') {
  const dic = localStorage.getItem('dictionary');
  if (!dic) {
    const [, res] = await getBySystemId({ systemId });
    if (res) localStorage.setItem('dictionary', JSON.stringify(res));
  }
}

/**
 * 登录
 * @param {} params
 */
export function login(params, handler) {
  return ErrorBoundary(
    post(`${getBaseURL()}${API.login}`, params),
    handler
  );
}

/**
 * 登录退出
 * @param {} params
 */
export function loginOut() {
  return ErrorBoundary(post(`${getBaseURL()}${API.loginOut}`));
}

/**
 * 用户注册
 * @date 2020-08-13
 * @param {any} params
 * @param {any} handler
 * @returns {any}
 */
export function register(params, handler) {
  return ErrorBoundary(
    post(`${getBaseURL()}${API.register}`, params),
    handler
  );
}
