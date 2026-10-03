/**
 * 全局通用类型定义
 */

/** 统一 API 响应结构 */
export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 分页请求参数 */
export interface PaginationParams {
  page?: number
  page_size?: number
}

/** 分页响应结构 */
export interface PaginatedData<T> {
  total: number
  list: T[]
}
