import { ref, onUnmounted } from 'vue'

export function useCountdown(initialSeconds: number = 60) {
  const seconds = ref(initialSeconds)
  const isRunning = ref(false)
  let timerId: ReturnType<typeof setInterval> | null = null

  const start = (newSeconds?: number) => {
    if (newSeconds) {
      seconds.value = newSeconds
    }
    if (isRunning.value) return

    isRunning.value = true
    timerId = setInterval(() => {
      if (seconds.value > 0) {
        seconds.value--
      } else {
        stop()
      }
    }, 1000)
  }

  const stop = () => {
    isRunning.value = false
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    }
  }

  const reset = (newSeconds?: number) => {
    stop()
    seconds.value = newSeconds || initialSeconds
  }

  onUnmounted(() => {
    stop()
  })

  return {
    seconds,
    isRunning,
    start,
    stop,
    reset
  }
}
