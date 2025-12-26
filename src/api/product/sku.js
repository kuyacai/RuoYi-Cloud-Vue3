import request from '@/utils/request'

// 查询店铺商品SKU同步状态列表
export function listSku(query) {
  return request({
    url: '/product/sku/list',
    method: 'get',
    params: query
  })
}

// 查询店铺商品SKU同步状态详细
export function getSku(listingSkuId) {
  return request({
    url: '/product/sku/' + listingSkuId,
    method: 'get'
  })
}

// 新增店铺商品SKU同步状态
export function addSku(data) {
  return request({
    url: '/product/sku',
    method: 'post',
    data: data
  })
}

// 修改店铺商品SKU同步状态
export function updateSku(data) {
  return request({
    url: '/product/sku',
    method: 'put',
    data: data
  })
}

// 删除店铺商品SKU同步状态
export function delSku(listingSkuId) {
  return request({
    url: '/product/sku/' + listingSkuId,
    method: 'delete'
  })
}
