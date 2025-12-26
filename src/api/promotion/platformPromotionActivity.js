import request from '@/utils/request'

// 查询平台促销活动列表
export function listActivity(query) {
  return request({
    url: '/product/promotion/platformpromotionactivity/list',
    method: 'get',
    params: query
  })
}

// 查询平台促销活动详细
export function getActivity(activityId) {
  return request({
    url: '/product/promotion/platformpromotionactivity/' + activityId,
    method: 'get'
  })
}

// 新增平台促销活动
export function addActivity(data) {
  return request({
    url: '/product/promotion/platformpromotionactivity',
    method: 'post',
    data: data
  })
}

// 修改平台促销活动
export function updateActivity(data) {
  return request({
    url: '/product/promotion/platformpromotionactivity',
    method: 'put',
    data: data
  })
}

// 删除平台促销活动
export function delActivity(activityId) {
  return request({
    url: '/product/promotion/platformpromotionactivity/' + activityId,
    method: 'delete'
  })
}
