// enumService.js
import request from '@/utils/request'

/**
 * 枚举服务类
 * 针对不同业务模块创建不同的实例
 */
class EnumService {
    /**
     * 构造函数
     * @param {string} moduleName 模块名称，如 'product', 'system', 'order'
     */
    constructor(moduleName) {
        this.moduleName = moduleName
        this.cache = new Map()
        this.promiseCache = new Map()
    }

    /**
     * 获取单个枚举
     * @param {string} enumName 枚举类名
     * @param {boolean} forceRefresh 是否强制刷新
     */
    async getEnum(enumName, forceRefresh = false) {
        const cacheKey = enumName

        if (!forceRefresh && this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey)
        }

        if (this.promiseCache.has(cacheKey)) {
            return this.promiseCache.get(cacheKey)
        }

        // Ruoyi 风格的请求
        const promise = request({
            url: `/${this.moduleName}/enums/${enumName}`,
            method: 'get'
        }).then(response => {
            const data = response.data || response
            this.cache.set(cacheKey, data)
            this.promiseCache.delete(cacheKey)
            return data
        }).catch(error => {
            this.promiseCache.delete(cacheKey)
            throw error
        })

        this.promiseCache.set(cacheKey, promise)
        return promise
    }

    /**
     * 批量获取枚举
     * 使用POST方式避免URL参数问题
     */
    async getEnums(enumNames, forceRefresh = false) {
        console.log('=== EnumService.getEnums 开始 ===')
        console.log('模块名:', this.moduleName)
        console.log('请求枚举:', enumNames)
        console.log('请求方式: POST')
        const result = {}
        const toFetch = []

        // 先从缓存获取
        for (const enumName of enumNames) {
            if (!forceRefresh && this.cache.has(enumName)) {
                result[enumName] = this.cache.get(enumName)
            } else {
                toFetch.push(enumName)
            }
        }

        // 批量请求剩余的
        if (toFetch.length > 0) {
            console.log('实际请求数据:', toFetch)
            // 使用POST请求，避免GET参数序列化问题
            try {
                const response = await request({
                    url: `/${this.moduleName}/enums/batch`,
                    method: 'post',
                    data: toFetch  // 这里是 POST 的 body
                })

                console.log('响应数据:', response)

                const data = response.data || response
                Object.entries(data).forEach(([key, value]) => {
                    this.cache.set(key, value)
                    result[key] = value
                })
            } catch (error) {
                console.error('请求失败:', error)
                throw error
            }
        }

        console.log('=== EnumService.getEnums 结束 ===')
        return result
    }

    /**
     * 获取枚举标签
     */
    getLabel(enumName, code) {
        const enums = this.cache.get(enumName)
        if (!enums) {
            console.warn(`[${this.moduleName}] 枚举 ${enumName} 未加载`)
            return code || ''
        }
        const item = enums.find(e => e.code === code)
        return item ? item.label : code
    }

    /**
     * 获取下拉框选项
     */
    getOptions(enumName) {
        const enums = this.cache.get(enumName)
        if (!enums) return []
        return enums.map(e => ({
            value: e.code,
            label: e.label,
            raw: e
        }))
    }

    /**
     * 预加载常用枚举
     */
    async preloadCommonEnums(commonEnums) {
        return this.getEnums(commonEnums)
    }

    /**
     * 清空缓存
     */
    clearCache() {
        this.cache.clear()
        this.promiseCache.clear()
    }

    /**
   * 格式化枚举显示
   * @param {*} statusValue 可能是字符串、数字、枚举对象
   * @returns {string} 显示文本
   */
  formatEnumDisplay(statusValue) {
    if (!statusValue) return ''
    
    // 如果是枚举对象
    if (typeof statusValue === 'object') {
      return statusValue.label || statusValue.desc || statusValue.name || ''
    }
    
    // 如果是字符串或数字
    return String(statusValue)
  }

  /**
   * 获取枚举值（用于表单提交等需要具体值的场景）
   */
  getEnumValue(statusValue) {
    if (!statusValue) return ''
    
    if (typeof statusValue === 'object') {
      return statusValue.code || statusValue.value || statusValue
    }
    
    return statusValue
  }
}

// 创建各模块的枚举服务实例
export const productEnumService = new EnumService('product')
//export const systemEnumService = new EnumService('system')
//export const orderEnumService = new EnumService('order')

// 默认导出产品模块（根据项目需要调整）
export default productEnumService