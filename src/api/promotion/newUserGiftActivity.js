import request from '@/utils/request'

// 查询新用户礼包活动列表
export function listActivity(query) {
  return request({
    url: '/product/promotion/newusergiftactivity/list',
    method: 'get',
    params: query
  })
}

// 查询新用户礼包活动详细
export function getActivity(activityId) {
  return request({
    url: '/product/promotion/newusergiftactivity/' + activityId,
    method: 'get'
  })
}

// 新增新用户礼包活动
export function addActivity(data) {
  return request({
    url: '/product/promotion/newusergiftactivity',
    method: 'post',
    data: data
  })
}

// 修改新用户礼包活动
export function updateActivity(data) {
  return request({
    url: '/product/promotion/newusergiftactivity',
    method: 'put',
    data: data
  })
}

// 删除新用户礼包活动
export function delActivity(activityId) {
  return request({
    url: '/product/promotion/newusergiftactivity/' + activityId,
    method: 'delete'
  })
}
