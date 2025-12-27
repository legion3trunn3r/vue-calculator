<template>
  <div class="calculator-container">
    <!-- History Panel -->
    <div v-if="showHistory" class="history-panel">
      <div class="history-header">
        <h3 class="text-lg font-semibold">История</h3>
        <button
          @click="closeHistory"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>
      <div class="history-list">
        <div v-if="history.length === 0" class="text-center text-gray-500 py-6">
          История пуста
        </div>
        <div
          v-for="(entry, index) in history"
          :key="index"
          class="history-item"
          @click="useHistoryEntry(entry.result)"
        >
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ entry.expression }}
          </div>
          <div class="font-semibold text-gray-900 dark:text-white">
            = {{ entry.result }}
          </div>
        </div>
      </div>
    </div>

    <!-- Main Calculator -->
    <div class="calculator">
      <!-- Display -->
      <div class="display mb-4">
        <div
          class="text-right text-gray-600 dark:text-gray-400 text-sm mb-2 h-6 overflow-hidden"
        >
          {{ previousValue }} {{ operator }}
        </div>
        <div
          class="text-right text-4xl font-mono font-bold text-gray-900 dark:text-white min-h-[4rem] flex items-center justify-end overflow-hidden break-words"
        >
          {{ displayValue }}
        </div>
      </div>

      <!-- Buttons Grid -->
      <div class="grid grid-cols-4 gap-2 mb-4">
        <!-- Row 1 -->
        <button @click="clear" class="btn-clear">AC</button>
        <button @click="backspace" class="btn-function">⌫</button>
        <button @click="toggleHistory" class="btn-function">📋</button>
        <button @click="appendOperator('/')" class="btn-operator">÷</button>

        <!-- Row 2 -->
        <button @click="appendNumber('7')" class="btn-number">7</button>
        <button @click="appendNumber('8')" class="btn-number">8</button>
        <button @click="appendNumber('9')" class="btn-number">9</button>
        <button @click="appendOperator('*')" class="btn-operator">×</button>

        <!-- Row 3 -->
        <button @click="appendNumber('4')" class="btn-number">4</button>
        <button @click="appendNumber('5')" class="btn-number">5</button>
        <button @click="appendNumber('6')" class="btn-number">6</button>
        <button @click="appendOperator('-')" class="btn-operator">-</button>

        <!-- Row 4 -->
        <button @click="appendNumber('1')" class="btn-number">1</button>
        <button @click="appendNumber('2')" class="btn-number">2</button>
        <button @click="appendNumber('3')" class="btn-number">3</button>
        <button @click="appendOperator('+')" class="btn-operator">+</button>

        <!-- Row 5 -->
        <button @click="appendNumber('0')" class="btn-number col-span-2">
          0
        </button>
        <button @click="appendDecimal" class="btn-number">.</button>
        <button @click="calculate" class="btn-equals">=</button>
      </div>

      <!-- Advanced Operations Row -->
      <div class="grid grid-cols-4 gap-2">
        <button @click="appendOperator('%')" class="btn-function">%</button>
        <button @click="toggleMemory" title="M+" class="btn-function">M</button>
        <button @click="copyToClipboard" class="btn-function">📋</button>
        <button @click="appendOperator('^')" class="btn-function">^</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue'
  import { useCalculatorHistory } from '../composables/useCalculatorHistory'
  import { useKeyboardSupport } from '../composables/useKeyboardSupport'

  const currentValue = ref('0')
  const previousValue = ref('')
  const operator = ref('')
  const waitingForNewValue = ref(false)
  const memory = ref(0)
  const showHistory = ref(false)

  const { history, addToHistory, clearHistory, removeHistoryEntry } =
    useCalculatorHistory()

  const displayValue = computed(() => {
    return currentValue.value
  })

  const appendNumber = (num: string) => {
    if (waitingForNewValue.value) {
      currentValue.value = num
      waitingForNewValue.value = false
    } else {
      currentValue.value =
        currentValue.value === '0' ? num : currentValue.value + num
    }
  }

  const appendDecimal = () => {
    if (waitingForNewValue.value) {
      currentValue.value = '0.'
      waitingForNewValue.value = false
    } else if (currentValue.value.indexOf('.') === -1) {
      currentValue.value += '.'
    }
  }

  const appendOperator = (op: string) => {
    if (operator.value && !waitingForNewValue.value) {
      calculate()
    }

    previousValue.value = currentValue.value
    operator.value = op
    waitingForNewValue.value = true
  }

  const calculate = () => {
    const prev = parseFloat(previousValue.value)
    const current = parseFloat(currentValue.value)
    let result = 0

    switch (operator.value) {
      case '+':
        result = prev + current
        break
      case '-':
        result = prev - current
        break
      case '*':
        result = prev * current
        break
      case '/':
        if (current === 0) {
          currentValue.value = 'Ошибка'
          previousValue.value = ''
          operator.value = ''
          waitingForNewValue.value = true
          return
        }
        result = prev / current
        break
      case '%':
        result = prev % current
        break
      case '^':
        result = Math.pow(prev, current)
        break
      default:
        return
    }

    const resultStr = result.toString()
    const expression = `${previousValue.value} ${operator.value} ${currentValue.value}`
    addToHistory(expression, resultStr)

    currentValue.value = resultStr
    previousValue.value = ''
    operator.value = ''
    waitingForNewValue.value = true
  }

  const clear = () => {
    currentValue.value = '0'
    previousValue.value = ''
    operator.value = ''
    waitingForNewValue.value = false
  }

  const backspace = () => {
    if (currentValue.value.length > 1) {
      currentValue.value = currentValue.value.slice(0, -1)
    } else {
      currentValue.value = '0'
    }
  }

  const toggleMemory = () => {
    const current = parseFloat(currentValue.value)
    memory.value += current
    currentValue.value = '0'
    waitingForNewValue.value = true
  }

  const toggleHistory = () => {
    showHistory.value = !showHistory.value
  }

  const closeHistory = () => {
    showHistory.value = false
  }

  const useHistoryEntry = (value: string) => {
    currentValue.value = value
    waitingForNewValue.value = true
    showHistory.value = false
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentValue.value)
      // Visual feedback could be added here
    } catch (_err) {
      console.error('Не удалось скопировать')
    }
  }

  // Keyboard support
  const callbacks = {
    appendNumber,
    appendDecimal,
    appendOperator,
    calculate,
    clear,
    backspace,
  }

  const { handleKeyDown } = useKeyboardSupport(callbacks)

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
</script>

<style scoped>
  .calculator-container {
    @apply relative w-full;
  }

  .calculator {
    @apply bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-4 shadow-2xl min-w-0;
  }

  .display {
    @apply bg-white dark:bg-gray-700 rounded-2xl p-4 mb-6 shadow-inner;
  }

  .history-panel {
    @apply absolute left-0 top-0 w-64 h-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden mb-4;
  }

  .history-header {
    @apply flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700;
  }

  .history-list {
    @apply flex-1 overflow-y-auto;
  }

  .history-item {
    @apply p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150;
  }

  /* Button Styles with Animations */
  .btn-number,
  .btn-operator,
  .btn-function,
  .btn-clear,
  .btn-equals {
    @apply font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform;
    @apply active:scale-95 active:shadow-inner;
    @apply hover:shadow-lg;
  }

  .btn-number {
    @apply bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white;
  }

  .btn-operator {
    @apply bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white;
  }

  .btn-function {
    @apply bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 text-white;
  }

  .btn-clear {
    @apply bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-500 text-white;
  }

  .btn-equals {
    @apply bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-500 text-white font-bold;
  }
</style>
