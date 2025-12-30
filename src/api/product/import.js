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
  return uploadFile('/product/excel/spu', formData, params)
}

/**
 * 导入SKU
 * @param {FormData} formData - 表单数据
 * @param {Object} params - 查询参数
 * @returns {Promise} 请求Promise
 */
export function importSku(formData, params) {
  return uploadFile('/product/excel/sku', formData, params)
}
// 导入价格文件
export function importPrice(formData, params) {
  return uploadFile('/product/excel/price', formData, params)
}

// 导入修改标题文件
export function importTitle(formData, params) {
  return uploadFile('/product/excel/title', formData, params)
}
// 导入单品直降文件
export function importSingleDiscount(formData, params) {
  return uploadFile('/product/excel/single-discount', formData, params)
}

// 导入商品通用优惠文件
export function importProductDiscount(formData, params) {
  return uploadFile('/product/excel/product-discount', formData, params)
}

// 导入新人礼金文件
export function importNewUser(formData, params) {
  return uploadFile('/product/excel/new-user', formData, params)
}

// 导入复购券优惠
export function importRepurchase(formData, params) {
  return uploadFile('/product/excel/repurchase', formData, params)
}

// 导入平台大促优惠
export function importPromotion(formData, params) {
  return uploadFile('/product/excel/promotion', formData, params)
}

export function downloadTemplate(type) {
  console.log('downloadTemplate, type:', type);
  
  return request({
    url: `/product/excel/template/${type}`,
    method: 'get',
    responseType: 'blob'
  }).then(response => {
    console.log('完整响应对象:', response);
    console.log('response.data 类型:', typeof response.data);
    console.log('response.data 构造函数:', response.data?.constructor?.name);
    console.log('response.data 是Blob吗?', response.data instanceof Blob);
    console.log('响应头:', response.headers);
    console.log('Content-Type:', response.headers?.['content-type']);
    
    // 如果是 ArrayBuffer，转换为 Blob
    if (response.data instanceof ArrayBuffer) {
      console.log('response.data 是 ArrayBuffer');
      const blob = new Blob([response.data]);
      return handleFileDownload(blob, response.headers, type);
    }
    
    // 如果是字符串，可能是错误信息
    if (typeof response.data === 'string') {
      console.log('response.data 是字符串:', response.data.substring(0, 100));
      try {
        const json = JSON.parse(response.data);
        throw new Error(json.msg || json.message || '下载失败');
      } catch (e) {
        throw new Error('服务器返回错误: ' + response.data);
      }
    }
    
    // 如果是对象但不是Blob，尝试处理
    if (response.data && typeof response.data === 'object' && !(response.data instanceof Blob)) {
      console.log('response.data 是普通对象:', response.data);
      // 尝试转换为JSON字符串再判断
      if (response.data.code || response.data.msg) {
        throw new Error(response.data.msg || '下载失败');
      }
    }
    
    // 如果是Blob，直接处理
    if (response.data instanceof Blob) {
      return handleFileDownload(response.data, response.headers, type);
    }
    
    throw new Error('响应格式错误: ' + typeof response.data);
  }).catch(error => {
    console.error('下载失败:', error);
    console.error('错误详情:', error.response || error);
    throw error;
  });
}

// 提取文件下载处理逻辑
function handleFileDownload(blob, headers, type) {
  console.log('处理文件下载，blob类型:', blob.type, '大小:', blob.size);
  
  // 检查是否是错误JSON伪装成blob
  if (blob.type.includes('application/json') || blob.size < 1024) {
    return blob.text().then(text => {
      console.log('blob内容:', text.substring(0, 200));
      try {
        const json = JSON.parse(text);
        throw new Error(json.msg || json.message || '下载失败');
      } catch (e) {
        if (text.includes('错误') || text.includes('失败') || text.includes('Exception')) {
          throw new Error(text);
        }
        // 如果不是错误信息，继续处理
      }
    });
  }
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  let filename = `${type}_template.xlsx`;
  
  // 尝试从响应头获取文件名
  const disposition = headers?.['content-disposition'] || headers?.['Content-Disposition'];
  if (disposition) {
    console.log('Content-Disposition:', disposition);
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(disposition);
    if (matches && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
      console.log('提取到的文件名:', filename);
    }
  }
  
  link.href = url;
  link.setAttribute('download', decodeURIComponent(filename));
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
  
  console.log('文件下载完成:', filename);
}

// 检查导入状态
export function checkImportStatus(type) {
  return request({
    url: `/product/excel/status/${type}`,
    method: 'get'
  })
}

// 获取支持的导入类型
export function getImportTypes() {
  return request({
    url: '/product/excel/types',
    method: 'get'
  })
}

// 验证文件格式
export function validateFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request({
    url: '/product/excel/validate',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}


