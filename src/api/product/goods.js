import request from '@/utils/request'

// 查询云商品根列表
export function listGoods(query) {
  return request({
    url: '/product/goods/list',
    method: 'get',
    params: query
  })
}

// 查询云商品根详细
export function getGoods(goodsId) {
  return request({
    url: '/product/goods/' + goodsId,
    method: 'get'
  })
}

// 新增云商品根
export function addGoods(data) {
  return request({
    url: '/product/goods',
    method: 'post',
    data: data
  })
}

// 修改云商品根
export function updateGoods(data) {
  return request({
    url: '/product/goods',
    method: 'put',
    data: data
  })
}

// 删除云商品根
export function delGoods(goodsId) {
  return request({
    url: '/product/goods/' + goodsId,
    method: 'delete'
  })
}
