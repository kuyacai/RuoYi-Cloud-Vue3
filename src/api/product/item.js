import request from '@/utils/request'

// 查询SKU 快照列表
export function listItem(query) {
  return request({
    url: '/product/item/list',
    method: 'get',
    params: query
  })
}

// 查询SKU 快照详细
export function getItem(itemId) {
  return request({
    url: '/product/item/' + itemId,
    method: 'get'
  })
}

// 新增SKU 快照
export function addItem(data) {
  return request({
    url: '/product/item',
    method: 'post',
    data: data
  })
}

// 修改SKU 快照
export function updateItem(data) {
  return request({
    url: '/product/item',
    method: 'put',
    data: data
  })
}

// 删除SKU 快照
export function delItem(itemId) {
  return request({
    url: '/product/item/' + itemId,
    method: 'delete'
  })
}
