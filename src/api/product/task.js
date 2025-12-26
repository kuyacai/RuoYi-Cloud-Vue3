import request from '@/utils/request'

// 查询任务实例列表
export function listTask(query) {
  return request({
    url: '/product/task/list',
    method: 'get',
    params: query
  })
}

// 查询任务实例详细
export function getTask(taskId) {
  return request({
    url: '/product/task/' + taskId,
    method: 'get'
  })
}

// 新增任务实例
export function addTask(data) {
  return request({
    url: '/product/task',
    method: 'post',
    data: data
  })
}

// 修改任务实例
export function updateTask(data) {
  return request({
    url: '/product/task',
    method: 'put',
    data: data
  })
}

// 删除任务实例
export function delTask(taskId) {
  return request({
    url: '/product/task/' + taskId,
    method: 'delete'
  })
}
