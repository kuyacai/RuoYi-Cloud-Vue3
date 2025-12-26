import request from '@/utils/request'

// 查询异步任务列表
export function listTask(query) {
  return request({
    url: '/product/anynctask/list',
    method: 'get',
    params: query
  })
}

// 查询异步任务详细
export function getTask(taskId) {
  return request({
    url: '/product/anynctask/' + taskId,
    method: 'get'
  })
}

// 新增异步任务
export function addTask(data) {
  return request({
    url: '/product/anynctask',
    method: 'post',
    data: data
  })
}

// 修改异步任务
export function updateTask(data) {
  return request({
    url: '/product/anynctask',
    method: 'put',
    data: data
  })
}

// 删除异步任务
export function delTask(taskId) {
  return request({
    url: '/product/anynctask/' + taskId,
    method: 'delete'
  })
}
