import request from '@/utils/request'

// 查询单品直降活动商品列表
export function listProduct(query) {
  return request({
    url: '/product/promotion/singlediscountproduct/list',
    method: 'get',
    params: query
  })
}

// 查询单品直降活动商品详细
export function getProduct(id) {
  return request({
    url: '/product/promotion/singlediscountproduct/' + id,
    method: 'get'
  })
}

// 新增单品直降活动商品
export function addProduct(data) {
  return request({
    url: '/product/promotion/singlediscountproduct',
    method: 'post',
    data: data
  })
}

// 修改单品直降活动商品
export function updateProduct(data) {
  return request({
    url: '/product/promotion/singlediscountproduct',
    method: 'put',
    data: data
  })
}

// 删除单品直降活动商品
export function delProduct(id) {
  return request({
    url: '/product/promotion/singlediscountproduct/' + id,
    method: 'delete'
  })
}