import React from 'react';
import request from '@/utils/request';

export default class Index extends React.Component {
  componentDidMount() {
    // mock data
    request('/users').then(res => {
      // 打开控制台，可以看到输出
      console.log(res);
    });
    // POST数据
    request('/user/create', {
      method: 'POST',
      body: {
        name: 'troy',
        address: '江苏省镇江市京口区',
      },
    });
  }
  render() {
    return <h1>Hello World Index</h1>;
  }
}
