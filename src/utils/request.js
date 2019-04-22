import fetch from 'dva/fetch';
import router from 'umi/router';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

// 拿到当前的运行环境：开发环境/生产环境
const env = process.env.NODE_ENV === 'development';

// 根据环境选择接口地址：Mock/线上接口
const baseUrl = env ? '/mock' : 'http://api.domain.com';

// fetch只对网络请求报错，对400，500都当做成功的请求
const checkResponse = response => {
  // 响应成功
  if (response.status >= 200 && response.status < 300) return response;
  // 根据状态码判断响应失败
  const message = codeMessage[response.status];
  const error = new Error(message);
  // 异常抛出，被Promise catch捕获处理
  error.status = response.status;
  throw error;
};

// 具体的请求操作
const request = (url, options) => {
  let api = url;
  // 第三方链接，不需要添加接口地址前缀
  if (!url.match(/http(s)?:\/\//)) api = `${baseUrl}${url}`;
  // 默认参数
  const defaultOptions = {
    method: 'GET',
    headers: {
      // 跨域cors
      'Access-Control-Allow-Origin': '*',
      // 请求携带cookie
      credentials: 'include',
    },
  };

  const newOptions = { ...defaultOptions, ...options };
  // method统一大写格式
  if (newOptions.method) newOptions.method = newOptions.method.toUpperCase();

  // 根据请求，参数调整
  const { headers, method, body } = newOptions;
  if (method === 'POST' || method === 'PUT' || method === 'DELETE') {
    // Not FormData
    if (!(body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...headers,
      };
      newOptions.body = JSON.stringify(body);
    }
  } else {
    // FormData
    newOptions.headers = {
      Accept: 'application/json',
      ...headers,
    };
  }

  return fetch(api, newOptions)
    .then(checkResponse)
    .then(response => {
      if (newOptions.method.toUpperCase() === 'DELETE' || response.status === 204)
        return response.text();
      return response.json();
    })
    .catch(e => {
      const { status } = e;
      // 401 响应
      if (status === 401) return;

      // 403 响应
      if (status === 403) {
        // 403 handler
        router.push('/exception/403');
        return;
      }

      // 404 Not Found
      if (status >= 404 && status < 422) {
        // 404 handler
        router.push('/exception/404');
        return;
      }

      if (status <= 504 && status >= 500) {
        // 500 handler
        router.push('/exception/500');
        return;
      }
    });
};

// 模块化输出
export default request;
