import request from '@/utils/request'

// 查询goods 图片列表
export function listImage(query) {
  return request({
    url: '/product/image/list',
    method: 'get',
    params: query
  })
}

// 查询goods 图片详细
export function getImage(imageId) {
  return request({
    url: '/product/image/' + imageId,
    method: 'get'
  })
}

// 新增goods 图片
export function addImage(data) {
  return request({
    url: '/product/image',
    method: 'post',
    data: data
  })
}

// 修改goods 图片
export function updateImage(data) {
  return request({
    url: '/product/image',
    method: 'put',
    data: data
  })
}

// 删除goods 图片
export function delImage(imageId) {
  return request({
    url: '/product/image/' + imageId,
    method: 'delete'
  })
}
