import { ref, computed } from 'vue'

export interface HistoryEntry {
  expression: string
  result: string
  timestamp: Date
}

export const useCalculatorHistory = () => {
  const history = ref<HistoryEntry[]>([])
  const maxHistorySize = 50

  const addToHistory = (expression: string, result: string) => {
    history.value.unshift({
      expression,
      result,
      timestamp: new Date(),
    })

    // Keep only the last maxHistorySize entries
    if (history.value.length > maxHistorySize) {
      history.value.pop()
    }
  }

  const clearHistory = () => {
    history.value = []
  }

  const getHistory = computed(() => history.value)

  const removeHistoryEntry = (index: number) => {
    history.value.splice(index, 1)
  }

  return {
    history: getHistory,
    addToHistory,
    clearHistory,
    removeHistoryEntry,
  }
}
