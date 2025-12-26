/**
 * 字符串工具函数
 */

/**
 * 截断字符串（从前面截断）
 * @param {string} str - 原始字符串
 * @param {number} keepLength - 保留的字符数
 * @param {string} suffix - 后缀，默认为 '...'
 * @returns {string} 截断后的字符串
 */
export function truncateFront(str, keepLength, suffix = '...') {
  if (!str || typeof str !== 'string') return str
  if (str.length <= keepLength) return str
  return suffix + str.slice(-keepLength)
}

/**
 * 截断字符串（从后面截断）
 * @param {string} str - 原始字符串
 * @param {number} keepLength - 保留的字符数
 * @param {string} suffix - 后缀，默认为 '...'
 * @returns {string} 截断后的字符串
 */
export function truncateBack(str, keepLength, suffix = '...') {
  if (!str || typeof str !== 'string') return str
  if (str.length <= keepLength) return str
  return str.slice(0, keepLength) + suffix
}

/**
 * 格式化ID显示（自动选择合适的截断方式）
 * @param {string} id - 原始ID
 * @param {number} maxLength - 最大显示长度
 * @returns {string} 格式化后的ID
 */
export function formatId(id, maxLength = 10) {
  if (!id) return ''
  if (id.length <= maxLength) return id
  
  // 如果是数字ID或类似格式，从后面截断
  if (/^\d+$/.test(id)) {
    return truncateFront(id, maxLength)
  }
  
  // 如果是UUID或其他复杂格式，从前面截断
  return truncateFront(id, maxLength)
}