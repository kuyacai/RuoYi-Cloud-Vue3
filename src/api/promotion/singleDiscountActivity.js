import request from '@/utils/request'

// 查询单品直降活动列表
export function listActivity(query) {
  return request({
    url: '/product/promotion/singlediscountactivity/list',
    method: 'get',
    params: query
  })
}

// 查询单品直降活动详细
export function getActivity(activityId) {
  return request({
    url: '/product/promotion/singlediscountactivity/' + activityId,
    method: 'get'
  })
}

// 新增单品直降活动
export function addActivity(data) {
  return request({
    url: '/product/promotion/singlediscountactivity',
    method: 'post',
    data: data
  })
}

// 修改单品直降活动
export function updateActivity(data) {
  return request({
    url: '/product/promotion/singlediscountactivity',
    method: 'put',
    data: data
  })
}

// 删除单品直降活动
export function delActivity(activityId) {
  return request({
    url: '/product/promotion/singlediscountactivity/' + activityId,
    method: 'delete'
  })
}
