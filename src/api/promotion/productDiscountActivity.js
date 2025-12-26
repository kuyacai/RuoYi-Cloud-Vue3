import request from '@/utils/request'

// 查询商品优惠活动列表
export function listActivity(query) {
  return request({
    url: '/product/promotion/productdiscountactivity/list',
    method: 'get',
    params: query
  })
}

// 查询商品优惠活动详细
export function getActivity(activityId) {
  return request({
    url: '/product/promotion/productdiscountactivity/' + activityId,
    method: 'get'
  })
}

// 新增商品优惠活动
export function addActivity(data) {
  return request({
    url: '/product/promotion/productdiscountactivity',
    method: 'post',
    data: data
  })
}

// 修改商品优惠活动
export function updateActivity(data) {
  return request({
    url: '/product/promotion/productdiscountactivity',
    method: 'put',
    data: data
  })
}

// 删除商品优惠活动
export function delActivity(activityId) {
  return request({
    url: '/product/promotion/productdiscountactivity/' + activityId,
    method: 'delete'
  })
}
