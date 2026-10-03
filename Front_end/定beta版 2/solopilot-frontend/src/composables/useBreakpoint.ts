import { ref, onMounted, onUnmounted } from 'vue'

export type Breakpoint = 'mobile' | 'tablet' | 'desktop' | 'wide'

export function useBreakpoint() {
  const breakpoint = ref<Breakpoint>('desktop')
  const width = ref(1024)

  const updateBreakpoint = () => {
    width.value = window.innerWidth
    if (width.value < 768) {
      breakpoint.value = 'mobile'
    } else if (width.value < 1024) {
      breakpoint.value = 'tablet'
    } else if (width.value < 1440) {
      breakpoint.value = 'desktop'
    } else {
      breakpoint.value = 'wide'
    }
  }

  onMounted(() => {
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateBreakpoint)
  })

  const isMobile = () => breakpoint.value === 'mobile'
  const isTablet = () => breakpoint.value === 'tablet'
  const isDesktop = () => breakpoint.value === 'desktop'

  return {
    breakpoint,
    width,
    isMobile,
    isTablet,
    isDesktop
  }
}
