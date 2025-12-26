import request from '@/utils/request'

// 查询商品版本列表
export function listRevision(query) {
  return request({
    url: '/product/revision/list',
    method: 'get',
    params: query
  })
}

// 查询商品版本详细
export function getRevision(revisionId) {
  return request({
    url: '/product/revision/' + revisionId,
    method: 'get'
  })
}

// 新增商品版本
export function addRevision(data) {
  return request({
    url: '/product/revision',
    method: 'post',
    data: data
  })
}

// 修改商品版本
export function updateRevision(data) {
  return request({
    url: '/product/revision',
    method: 'put',
    data: data
  })
}

// 删除商品版本
export function delRevision(revisionId) {
  return request({
    url: '/product/revision/' + revisionId,
    method: 'delete'
  })
}
