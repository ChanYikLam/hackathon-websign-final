/**
 * SoloPilot 图标数据 - 离线内联注册
 *
 * 将所有用到的 MDI 图标的 SVG body 预注册到 @iconify/vue，
 * 避免运行时在线加载（消除 API 请求延迟和网络依赖）。
 *
 * 维护方式：
 * - 新增图标时，到 https://iconify.design/ 搜索图标名
 * - 复制 SVG path 的 d 属性作为 body
 * - 添加到下面的 map 中
 */

export interface IconData {
  body: string
  width?: number
  height?: number
}

export const iconRegistry: Record<string, IconData> = {
  // ====== 导航 & 布局 ======
  'mdi:home': {
    body: '<path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3L2 12h3v8z"/>',
    width: 24, height: 24
  },
  'mdi:clipboard-check': {
    body: '<path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-7 0a1 1 0 1 1 0 2a1 1 0 0 1 0-2m-2 14l-3.5-3.5l1.41-1.41L10 14.17l5.59-5.59L17 10"/>',
    width: 24, height: 24
  },
  'mdi:text-box': {
    body: '<path fill="currentColor" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm0 2h7v5h5v11zm2 8v2h8v-2zm0 4v2h5v-2z"/>',
    width: 24, height: 24
  },
  'mdi:robot': {
    body: '<path fill="currentColor" d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.07A7 7 0 0 1 14 22H10a7 7 0 0 1-6.93-3H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2m-2 12a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m4 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3"/>',
    width: 24, height: 24
  },
  'mdi:dots-horizontal': {
    body: '<path fill="currentColor" d="M16 12a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2m-6 0a2 2 0 0 1 2-2a2 2 0 0 1 2 2a2 2 0 0 1-2 2a2 2 0 0 1-2-2"/>',
    width: 24, height: 24
  },

  // ====== 主题切换 ======
  'mdi:weather-sunny': {
    body: '<path fill="currentColor" d="M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3M2 13h2a1 1 0 0 0 0-2H2a1 1 0 0 0 0 2m18 0h2a1 1 0 0 0 0-2h-2a1 1 0 0 0 0 2M11 2v2a1 1 0 0 0 2 0V2a1 1 0 0 0-2 0m0 18v2a1 1 0 0 0 2 0v-2a1 1 0 0 0-2 0M5.99 4.58a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41zm12.37 12.37a.996.996 0 0 0-1.41 0a.996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41zm1.06-10.96a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06a.996.996 0 0 0 0 1.41c.38.39 1.02.39 1.41 0zM7.05 18.36a.996.996 0 0 0 0-1.41a.996.996 0 0 0-1.41 0l-1.06 1.06a.996.996 0 0 0 0 1.41c.39.39 1.03.39 1.41 0z"/>',
    width: 24, height: 24
  },
  'mdi:weather-night': {
    body: '<path fill="currentColor" d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.39 5.39 0 0 1-4.4 2.26a5.4 5.4 0 0 1-3.14-9.8A9.06 9.06 0 0 0 12 3z"/>',
    width: 24, height: 24
  },

  // ====== 通用操作 ======
  'mdi:arrow-left': {
    body: '<path fill="currentColor" d="M20 11v2H8l5.5 5.5l-1.42 1.42L4.16 12l7.92-7.92L13.5 5.5L8 11z"/>',
    width: 24, height: 24
  },
  'mdi:arrow-right': {
    body: '<path fill="currentColor" d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"/>',
    width: 24, height: 24
  },
  'mdi:close': {
    body: '<path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"/>',
    width: 24, height: 24
  },
  'mdi:close-circle': {
    body: '<path fill="currentColor" d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m5 13.59L15.59 17L12 13.41L8.41 17L7 15.59L10.59 12L7 8.41L8.41 7L12 10.59L15.59 7L17 8.41L13.41 12z"/>',
    width: 24, height: 24
  },
  'mdi:check': {
    body: '<path fill="currentColor" d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z"/>',
    width: 24, height: 24
  },
  'mdi:check-circle': {
    body: '<path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/>',
    width: 24, height: 24
  },
  'mdi:chevron-up': {
    body: '<path fill="currentColor" d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6l-6 6z"/>',
    width: 24, height: 24
  },
  'mdi:chevron-down': {
    body: '<path fill="currentColor" d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z"/>',
    width: 24, height: 24
  },
  'mdi:eye': {
    body: '<path fill="currentColor" d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"/>',
    width: 24, height: 24
  },
  'mdi:eye-off': {
    body: '<path fill="currentColor" d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3h-.17m-4.61.64l1.62 1.62A3 3 0 0 0 9 12a3 3 0 0 0 3 3c.36 0 .7-.07 1.02-.18l1.62 1.62C13.89 16.88 13 17.12 12 17.12a5 5 0 0 1-5-5c0-1 .24-1.89.64-2.72M2 4.27L3.77 6.04l.35.35A13.9 13.9 0 0 0 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.35.35L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .71l2.17 2.16C11.1 7.13 11.53 7 12 7"/>',
    width: 24, height: 24
  },
  'mdi:send': {
    body: '<path fill="currentColor" d="M2 21l21-9L2 3v7l15 2l-15 2z"/>',
    width: 24, height: 24
  },

  // ====== 业务图标 ======
  'mdi:brain': {
    body: '<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8m-1-13h2v6h-2zm0 8h2v2h-2z"/>',
    width: 24, height: 24
  },
  'mdi:chart-bell-curve-cumulative': {
    body: '<path fill="currentColor" d="M4 19V6h2v13H4m4 0V9h2v10H8m4 0V6h2v13h-2m4 0V9h2v10h-2m4 0V4h2v15h-2z"/>',
    width: 24, height: 24
  },
  'mdi:account-circle-outline': {
    body: '<path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8c0-1.44.38-2.79 1.05-3.96A5.95 5.95 0 0 0 9 14a5.95 5.95 0 0 0 3.96-1.05A7.93 7.93 0 0 1 12 18c-4.41 0-8-3.59-8-8m3.5-3A1.5 1.5 0 1 1 12 7.5A1.5 1.5 0 0 1 9.5 10.5"/>',
    width: 24, height: 24
  },
  'mdi:lightning-bolt': {
    body: '<path fill="currentColor" d="M7 2v11h3v9l7-12h-4l4-8z"/>',
    width: 24, height: 24
  },
  'mdi:puzzle-outline': {
    body: '<path fill="currentColor" d="M22 13.5c0 1.58-1.28 2.86-2.86 2.86c-.62 0-1.2-.2-1.68-.57l-2.49 2.49c.37.48.57 1.06.57 1.68c0 1.58-1.28 2.86-2.86 2.86s-2.86-1.28-2.86-2.86c0-.62.2-1.2.57-1.68l-2.49-2.49c-.48.37-1.06.57-1.68.57C5.28 16.36 4 15.08 4 13.5S5.28 10.64 6.86 10.64c.62 0 1.2.2 1.68.57l2.49-2.49c-.37-.48-.57-1.06-.57-1.68C10.46 6.28 11.74 5 13.32 5s2.86 1.28 2.86 2.86c0 .62-.2 1.2-.57 1.68l2.49 2.49c.48-.37 1.06-.57 1.68-.57C20.72 10.64 22 11.92 22 13.5"/>',
    width: 24, height: 24
  },
  'mdi:tools': {
    body: '<path fill="currentColor" d="M21.71 20.29l-1.42 1.42a1 1 0 0 1-1.41 0L12 14.84l-4.29 4.29a1 1 0 0 1-1.41 0l-1.42-1.42a1 1 0 0 1 0-1.41L9.17 12L3.51 6.34a1 1 0 0 1 0-1.41l1.42-1.42a1 1 0 0 1 1.41 0L12 9.17l5.66-5.66a1 1 0 0 1 1.41 0l1.42 1.42a1 1 0 0 1 0 1.41L14.83 12l5.66 5.66a1 1 0 0 1 0 1.41z"/>',
    width: 24, height: 24
  },
  'mdi:lightbulb-on-outline': {
    body: '<path fill="currentColor" d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1m3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7c0-3.9-3.1-7-7-7"/>',
    width: 24, height: 24
  },
  'mdi:lightbulb-outline': {
    body: '<path fill="currentColor" d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1m3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7c0-3.9-3.1-7-7-7m0 2c2.8 0 5 2.2 5 5c0 2.1-1.3 3.9-3.2 4.6l-.8.3V17h-2v-3.1l-.8-.3C8.3 12.9 7 11.1 7 9c0-2.8 2.2-5 5-5"/>',
    width: 24, height: 24
  },
  'mdi:robot-happy': {
    body: '<path fill="currentColor" d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.07A7 7 0 0 1 14 22H10a7 7 0 0 1-6.93-3H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2m-2 12a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m4 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3"/>',
    width: 24, height: 24
  },
  'mdi:robot-happy-outline': {
    body: '<path fill="currentColor" d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1.07A7 7 0 0 1 14 22H10a7 7 0 0 1-6.93-3H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73A2 2 0 0 1 12 2m-2 12a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3m4 0a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3"/>',
    width: 24, height: 24
  },
  'mdi:shield-check': {
    body: '<path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4m-2 16l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>',
    width: 24, height: 24
  },
  'mdi:shield-check-outline': {
    body: '<path fill="currentColor" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12c5.16-1.26 9-6.45 9-12V5l-9-4m0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>',
    width: 24, height: 24
  },
  'mdi:information': {
    body: '<path fill="currentColor" d="M13 9h-2V7h2m0 10h-2v-6h2m-1-9A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2"/>',
    width: 24, height: 24
  },
  'mdi:information-outline': {
    body: '<path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8"/>',
    width: 24, height: 24
  },
  'mdi:alert': {
    body: '<path fill="currentColor" d="M13 14h-2V9h2m0 9h-2v-2h2M1 21h22L12 2z"/>',
    width: 24, height: 24
  },
  'mdi:star': {
    body: '<path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21z"/>',
    width: 24, height: 24
  },
  'mdi:star-outline': {
    body: '<path fill="currentColor" d="M12 15.39l-3.76 2.27l.99-4.28l-3.32-2.88l4.38-.37L12 6.09l1.71 4.04l4.38.37l-3.32 2.88l.99 4.28M22 9.24l-7.19-.62L12 2L9.19 8.63L2 9.24l5.46 4.73L5.82 21L12 17.27L18.18 21l-1.63-7.03z"/>',
    width: 24, height: 24
  },
  'mdi:format-list-numbered': {
    body: '<path fill="currentColor" d="M7 13v2h1v1H6v-2H5v-1h2m-1-3V9h1v1H6v1H5V9h1V8h2v3H6m1-7v1H6V4h2v1H7M2 3h2v2H2v1h2v1H2v1h2v1H2v1h2v1H2v1h2v1H2v1h2v1H2v1h2v1H2M21 5v14H7v-2h12V7H7V5h14z"/>',
    width: 24, height: 24
  },
  'mdi:clock-outline': {
    body: '<path fill="currentColor" d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7h1.5z"/>',
    width: 24, height: 24
  },
  'mdi:clock-fast': {
    body: '<path fill="currentColor" d="M15 4a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8m0 1.5a6.5 6.5 0 0 1 6.5 6.5a6.5 6.5 0 0 1-6.5 6.5a6.5 6.5 0 0 1-6.5-6.5A6.5 6.5 0 0 1 15 5.5m-.5 2v5l2.5 1.5l-.75 1.23L13 13V7.5h1.5M2.5 5.5h6l-.5 2h-2l1 2.5l-1.5.5L4 7.5h-.5L3 9l-1.5-.5l1-3z"/>',
    width: 24, height: 24
  },
  'mdi:keyboard-outline': {
    body: '<path fill="currentColor" d="M4 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H4m0 2h16v10H4V7m1 1v2h2V8H5m3 0v2h2V8H8m3 0v2h2V8h-2m3 0v2h2V8h-2m3 0v2h2V8h-2M5 11v2h2v-2H5m3 0v2h2v-2H8m3 0v2h2v-2h-2m3 0v2h2v-2h-2m3 0v2h2v-2h-2M5 14v2h5v-2H5m7 0v2h2v-2h-2m3 0v2h4v-2h-4z"/>',
    width: 24, height: 24
  },
  'mdi:delete-sweep-outline': {
    body: '<path fill="currentColor" d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18h2V8H3v10zm4 0h2V8H7v10zm4 0h2V8h-2v10zm-8-2h1V6h4V4H1v2h1v10zm8-12h8v2h2V4h2V2h-8v2H11v2z"/>',
    width: 24, height: 24
  },
  'mdi:circle': {
    body: '<circle cx="12" cy="12" r="10" fill="currentColor"/>',
    width: 24, height: 24
  },
}
