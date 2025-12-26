import request from '@/utils/request'

/**
 * 通用文件上传函数
 * @param {string} url - 请求URL
 * @param {FormData} formData - 表单数据
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise
 */
export function uploadFile(url, formData, params) {
  console.log('上传文件参数详情：')
  console.log('URL:', url)
  console.log('FormData 内容：')
  // 打印 FormData 中的内容
  for (let [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value)
  }
  console.log('查询参数 params:', params)
  console.log('params 类型:', typeof params)
  return request({
    url,
    method: 'post',
    data: formData,
    params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 导入SPU
 * @param {FormData} formData - 表单数据
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise
 */
export function importSpu(formData, params) {
  return uploadFile('/product/import/spu', formData, params)
}

/**
 * 导入SKU
 * @param {FormData} formData - 表单数据
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise
 */
export function importSku(formData, params) {
  return uploadFile('/product/import/sku', formData, params)
}
// 导入价格文件
export function importPrice(formData, params) {
  return uploadFile('/product/import/price', formData, params)
}

// 导入修改标题文件
export function importTitle(formData, params) {
  return uploadFile('/product/import/title', formData, params)
}
// 导入单品直降文件
export function importSingleDiscount(formData, params) {
  return uploadFile('/product/import/single-discount', formData, params)
}

// 导入商品通用优惠文件
export function importProductDiscount(formData, params) {
  return uploadFile('/product/import/product-discount', formData, params)
}

// 导入新人礼金文件
export function importNewUser(formData, params) {
  return uploadFile('/product/import/new-user', formData, params)
}

// 导入复购券优惠
export function importRepurchase(formData, params) {
  return uploadFile('/product/import/repurchase', formData, params)
}

// 导入平台大促优惠
export function importPromotion(formData, params) {
  return uploadFile('/product/import/promotion', formData, params)
}

// 下载模板
export function downloadTemplate(type) {
  return request({
    url: `/product/import/template/${type}`,
    method: 'get',
    responseType: 'blob'
  })
}

// 检查导入状态
export function checkImportStatus(type) {
  return request({
    url: `/product/import/status/${type}`,
    method: 'get'
  })
}

// 获取支持的导入类型
export function getImportTypes() {
  return request({
    url: '/product/import/types',
    method: 'get'
  })
}

// 验证文件格式
export function validateFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/product/import/validate',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}


