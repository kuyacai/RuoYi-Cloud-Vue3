import request from '@/utils/request'

// 查询店铺商品同步状态列表
export function listSpu(query) {
  return request({
    url: '/product/spu/list',
    method: 'get',
    params: query
  })
}

// 查询店铺商品同步状态详细
export function getSpu(listingSpuId) {
  return request({
    url: '/product/spu/' + listingSpuId,
    method: 'get'
  })
}

// 新增店铺商品同步状态
export function addSpu(data) {
  return request({
    url: '/product/spu',
    method: 'post',
    data: data
  })
}

// 修改店铺商品同步状态
export function updateSpu(data) {
  return request({
    url: '/product/spu',
    method: 'put',
    data: data
  })
}

// 删除店铺商品同步状态
export function delSpu(listingSpuId) {
  return request({
    url: '/product/spu/' + listingSpuId,
    method: 'delete'
  })
}
