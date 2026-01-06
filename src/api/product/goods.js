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
// 查询商品信息详情
export function getDetail(id, status) {
  return request({
    url: '/product/goods/detail',
    method: 'get',
    params: { id, status } // 这里的 params 会自动拼接到 URL 后变成 ?id=...&status=...
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
