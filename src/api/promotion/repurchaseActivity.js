import request from '@/utils/request'

// 查询复购券活动列表
export function listActivity(query) {
  return request({
    url: '/product/promotion/repurchaseactivity/list',
    method: 'get',
    params: query
  })
}

// 查询复购券活动详细
export function getActivity(activityId) {
  return request({
    url: '/product/promotion/repurchaseactivity/' + activityId,
    method: 'get'
  })
}

// 新增复购券活动
export function addActivity(data) {
  return request({
    url: '/product/promotion/repurchaseactivity',
    method: 'post',
    data: data
  })
}

// 修改复购券活动
export function updateActivity(data) {
  return request({
    url: '/product/promotion/repurchaseactivity',
    method: 'put',
    data: data
  })
}

// 删除复购券活动
export function delActivity(activityId) {
  return request({
    url: '/product/promotion/repurchaseactivity/' + activityId,
    method: 'delete'
  })
}
