/**
 * 剪贴板工具函数
 */
import { ElMessage } from 'element-plus'

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @param {string} successMessage - 成功提示信息
 * @param {string} errorMessage - 错误提示信息
 * @returns {Promise<void>}
 */
export async function copyToClipboard(
  text, 
  successMessage = '已复制到剪贴板', 
  errorMessage = '复制失败'
) {
  if (!text) {
    ElMessage.warning('没有内容可复制')
    return
  }
  
  try {
    // 优先使用现代API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      // 降级方案
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    
    ElMessage.success(successMessage)
  } catch (error) {
    console.error('复制失败:', error)
    ElMessage.error(errorMessage)
  }
}