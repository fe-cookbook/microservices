/*
 * @Author: jubao.tian 
 * @Date: 2020-08-13 16:38:58 
 * @Last Modified by: jubao.tian
 * @Last Modified time: 2020-08-19 21:44:22
 */
import axiosRetry from 'axios-retry';
import axios, { AxiosInstance, Cancel } from 'axios';
import { Message } from 'element-ui';
import lodashGet from 'lodash/get';
import { TOKEN_OUT } from '../config';
import { isQiankun, sleep } from './index';

const pending: [] = [];
const Instance: AxiosInstance = axios.create({});

axiosRetry(Instance, {
  retryDelay: (retryCount) => {
    return retryCount * 1000;
  },
  shouldResetTimeout: true,
  retryCondition: (error) => {
    return (error.config.method === 'get' || error.config.method === 'post');
  }
});

const cancelToken = axios.CancelToken;
const removePending = (event: any) => {
  for (let index = 0; index < pending.length; index++) {
    const item: { url: string, cancel: () => void } = pending[index];
    let flag = event ? item.url === event.url : true
    if (flag) {
      item.cancel();
      pending.splice(item, 1);
    }
  }
};

Instance.interceptors.request.use(config => {
  if (localStorage.getItem('token')) {
    config.headers.common.token = localStorage.getItem('token');
  }
  if (config.method === 'get') {
    config.params = { ...config.params, stamp: Math.random() };
  }
  removePending(config);
  config.cancelToken = new cancelToken(c => {
    pending.push({ url: config.url, cancel: c });
  });
  return config;
});

Instance.interceptors.response.use(
  res => {
    if (res) {
      removePending(res.config);
      if (res.data.code === 200) {
        return res.data.data || res.data.result;
      }
      if (res.data.code === TOKEN_OUT) {
        removePending(null);
        setTimeout(() => {
          localStorage.clear();
          const { origin } = location;
          location.replace(`${origin}/login`);
        }, 500);
        throw Error('登录失效请重新登录！');
      }
      if (res.config.download) {
        if (res.data.size < 100) {
          return res.data.text().then(text => {
            return Promise.reject(JSON.parse(text));
          });
        } else {
          try {
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.download = decodeURIComponent(res.config.download);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            return true;
          } catch (error) { }
        }
      }
      return Promise.reject(res.data);
    }
  },
  (err) => {
    if (!err instanceof Cancel) {
      if (/timeout/gi.test(err.message)) {
        err.message = '网络超时，请稍后再试！';
      } else if (/Network Error/gi.test(err.message)) {
        err.message = '网络错误，请稍后再试！';
      }
      return Promise.reject(err);
    };
  }
);

/**
 * 全局错误处理函数
 * @param {*} promise
 * @param {*} handle
 */
export function ErrorBoundary<T>(promise: Promise<T>, handle?: () => void): Promise<any> {
  return promise
    .then(data => [null, data])
    .catch(err => {
      if (!handle) {
        setTimeout(() => {
          throw Error(err.message);
        }, 16);
      }
      return [err];
    });
}
const deletes = Instance.delete;
const { get, post, put } = Instance;
export {
  get, post, put, deletes
};

// if (!isQiankun()) {
window.addEventListener('unhandledrejection', (e) => {
  e.preventDefault();
  return true;
});

// window.addEventListener('error', (e) => {
//   e.preventDefault();
//   let message = (lodashGet(e, 'message') || '').replace(/Uncaught Error: /i, '');
//   if (message === 'undefined' || message === 'Uncaught Error') {
//     message = '';
//   }
//   const msg: string = message;
//   // ResizeObserver loop limit exceeded
//   if (/ResizeObserver|Script error|qiankun/.test(msg)) return;
//   Message.closeAll();
//   Message({
//     type: 'error',
//     dangerouslyUseHTMLString: true,
//     message: msg,
//     duration: 5000,
//     showClose: true,
//   });
// });
// }