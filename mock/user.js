import mockjs from 'mockjs';

const { Random } = mockjs;

export default {
  'GET /mock/users': mockjs.mock({
    'list|1-30': [{ name: '@cname', 'age|1-100': 10, address: '@county(true)' }],
    'page|1-20': 0,
    'size|1': [5, 10, 20, 30, 40],
  }),

  'POST /mock/user/create': {
    id: Random.string(),
  },
};
