<template>
  <div class="calculator-container">
    <!-- History Panel -->
    <Transition name="slide-right">
      <div v-if="showHistory" class="history-panel">
        <div class="history-header">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            📋 История
          </h3>
          <button
            @click="closeHistory"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 text-2xl"
          >
            ×
          </button>
        </div>
        <div class="history-list">
          <div v-if="history.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
            <p class="text-4xl mb-2">📝</p>
            <p>История пуста</p>
          </div>
          <TransitionGroup name="list" tag="div">
            <div
              v-for="(entry, index) in history"
              :key="index"
              class="history-item group"
              @click="useHistoryEntry(entry.result)"
            >
              <div class="flex justify-between items-start gap-2">
                <div class="flex-1">
                  <div class="text-xs text-gray-500 dark:text-gray-500 font-mono">
                    {{ entry.expression }}
                  </div>
                  <div class="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mt-1">
                    = {{ entry.result }}
                  </div>
                </div>
                <button
                  @click.stop="removeHistoryItem(index)"
                  class="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 text-sm transition-opacity duration-200"
                  title="Удалить"
                >
                  ✕
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>
        <div class="history-footer">
          <button
            @click="clearHistory"
            class="w-full py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 font-semibold"
          >
            Очистить
          </button>
        </div>
      </div>
    </Transition>

    <!-- Backdrop for history -->
    <Transition name="fade">
      <div 
        v-if="showHistory" 
        class="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        @click="closeHistory"
      ></div>
    </Transition>

    <!-- Main Calculator -->
    <div class="calculator">
      <!-- Display -->
      <div class="display-container mb-6">
        <div class="display-header">
          <div class="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
            Операция
          </div>
          <div class="text-right text-gray-600 dark:text-gray-400 text-sm font-mono">
            <span v-if="previousValue" class="animate-fade-in">{{ previousValue }}</span>
            <span v-if="operator" class="ml-2 text-blue-500 font-bold">{{ operator }}</span>
          </div>
        </div>
        <div class="display-main">
          <div
            class="text-right text-5xl font-mono font-bold min-h-[3.5rem] flex items-center justify-end overflow-hidden break-words text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 dark:from-blue-400 dark:via-blue-300 dark:to-purple-400"
          >
            {{ displayValue }}
          </div>
        </div>
      </div>

      <!-- Buttons Grid -->
      <div class="grid grid-cols-4 gap-3 mb-4">
        <!-- Row 1 -->
        <button @click="clear" class="btn btn-clear" title="Очистить">
          <span class="text-2xl">⟲</span>
        </button>
        <button @click="backspace" class="btn btn-function" title="Удалить">
          <span class="text-xl">⌫</span>
        </button>
        <button @click="toggleHistory" class="btn btn-function relative" title="История">
          <span class="text-xl">📋</span>
          <span v-if="history.length > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {{ history.length }}
          </span>
        </button>
        <button @click="appendOperator('/')" class="btn btn-operator">÷</button>

        <!-- Row 2 -->
        <button @click="appendNumber('7')" class="btn btn-number">7</button>
        <button @click="appendNumber('8')" class="btn btn-number">8</button>
        <button @click="appendNumber('9')" class="btn btn-number">9</button>
        <button @click="appendOperator('*')" class="btn btn-operator">×</button>

        <!-- Row 3 -->
        <button @click="appendNumber('4')" class="btn btn-number">4</button>
        <button @click="appendNumber('5')" class="btn btn-number">5</button>
        <button @click="appendNumber('6')" class="btn btn-number">6</button>
        <button @click="appendOperator('-')" class="btn btn-operator">−</button>

        <!-- Row 4 -->
        <button @click="appendNumber('1')" class="btn btn-number">1</button>
        <button @click="appendNumber('2')" class="btn btn-number">2</button>
        <button @click="appendNumber('3')" class="btn btn-number">3</button>
        <button @click="appendOperator('+')" class="btn btn-operator">+</button>

        <!-- Row 5 -->
        <button @click="appendNumber('0')" class="btn btn-number col-span-2">
          0
        </button>
        <button @click="appendDecimal" class="btn btn-number">.</button>
        <button @click="calculate" class="btn btn-equals">=</button>
      </div>

      <!-- Advanced Operations Row -->
      <div class="grid grid-cols-4 gap-3">
        <button @click="appendOperator('%')" class="btn btn-function" title="Модуль">%</button>
        <button @click="toggleMemory" title="Память" class="btn btn-function" :class="{ 'ring-2 ring-yellow-400': memory !== 0 }">
          M<span v-if="memory !== 0" class="text-xs ml-1">{{ memory }}</span>
        </button>
        <button @click="copyToClipboard" class="btn btn-function" title="Копировать">
          <span class="text-lg">📋</span>
        </button>
        <button @click="appendOperator('^')" class="btn btn-function" title="Степень">x^y</button>
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

  const { history, addToHistory, clearHistory } = useCalculatorHistory()

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
          currentValue.value = 'Ошибка: ÷0'
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

  const removeHistoryItem = (index: number) => {
    const newHistory = history.value.slice()
    newHistory.splice(index, 1)
    history.value.length = 0
    history.value.push(...newHistory)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentValue.value)
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
    position: relative;
    width: 100%;
  }

  /* Display Styles */
  .calculator {
    background: linear-gradient(to bottom right, white, #f3f4f6, #e5e7eb);
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    min-width: 0;
  }

  .dark .calculator {
    background: linear-gradient(to bottom right, #1f2937, #0f766e, #111827);
  }

  .display-container {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .display-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .display-main {
    background: linear-gradient(to right, #eff6ff, #faf5ff);
    border-radius: 1rem;
    padding: 1.5rem;
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
    border: 1px solid #dbeafe;
    backdrop-filter: blur(10px);
  }

  .dark .display-main {
    background: linear-gradient(to right, #374151, #4b5563);
    border-color: #4b5563;
  }

  /* History Panel Styles */
  .history-panel {
    position: fixed;
    left: 0;
    top: 0;
    width: 18rem;
    height: 100%;
    background: white;
    border-radius: 0 1.5rem 1.5rem 0;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    z-index: 50;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid #e5e7eb;
  }

  .dark .history-panel {
    background: #1f2937;
    border-right-color: #374151;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
    background: linear-gradient(to right, #eff6ff, #faf5ff);
  }

  .dark .history-header {
    border-bottom-color: #374151;
    background: linear-gradient(to right, #374151, #4b5563);
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
  }

  .history-item {
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: all 200ms ease-in-out;
    transform: translateX(0);
  }

  .history-item:hover {
    background: linear-gradient(to right, #eff6ff, #faf5ff);
    transform: translateX(0.25rem);
  }

  .dark .history-item {
    border-bottom-color: #374151;
  }

  .dark .history-item:hover {
    background: linear-gradient(to right, #374151, #4b5563);
  }

  .history-footer {
    border-top: 1px solid #e5e7eb;
    padding: 1rem;
    background: #f9fafb;
  }

  .dark .history-footer {
    border-top-color: #374151;
    background: #0f172a;
  }

  /* Button Base Styles */
  .btn {
    font-weight: 600;
    font-size: 1.125rem;
    padding: 1rem 1.5rem;
    border-radius: 1rem;
    transition: all 200ms ease-in-out;
    transform: scale(1);
    border: none;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    color: inherit;
  }

  .btn:active {
    transform: scale(0.9);
    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  }

  .btn:hover {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    transform: scale(1.05);
  }

  .btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }

  .dark .btn:focus {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }

  .btn::before {
    position: absolute;
    inset: 0;
    background: white;
    opacity: 0;
    transition: opacity 300ms ease-in-out;
    content: '';
    pointer-events: none;
  }

  .btn:hover::before {
    opacity: 0.1;
  }

  .btn:active::before {
    opacity: 0.2;
  }

  /* Button Type Styles */
  .btn-number {
    background: linear-gradient(to bottom right, #e5e7eb, #d1d5db);
    color: #000000 !important;
    font-weight: 700;
    font-size: 1.125rem;
  }

  .btn-number:hover {
    background: linear-gradient(to bottom right, #d1d5db, #9ca3af);
  }

  .btn-number:focus {
    box-shadow: 0 0 0 3px #d1d5db;
  }

  .dark .btn-number {
    background: linear-gradient(to bottom right, #374151, #4b5563);
    color: #ffffff !important;
    font-weight: 700;
    font-size: 1.125rem;
  }

  .dark .btn-number:hover {
    background: linear-gradient(to bottom right, #4b5563, #6b7280);
  }

  .dark .btn-number:focus {
    box-shadow: 0 0 0 3px #6b7280;
  }

  .btn-operator {
    background: linear-gradient(to bottom right, #3b82f6, #1d4ed8);
    color: white;
    font-weight: 700;
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
  }

  .btn-operator:hover {
    background: linear-gradient(to bottom right, #1d4ed8, #1e40af);
  }

  .btn-operator:focus {
    box-shadow: 0 0 0 3px #3b82f6;
  }

  .dark .btn-operator {
    background: linear-gradient(to bottom right, #1d4ed8, #1e40af);
  }

  .dark .btn-operator:hover {
    background: linear-gradient(to bottom right, #1e40af, #1e3a8a);
  }

  .dark .btn-operator:focus {
    box-shadow: 0 0 0 3px #1d4ed8;
  }

  .btn-function {
    background: linear-gradient(to bottom right, #a855f7, #9333ea);
    color: white;
    font-weight: 600;
    box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.3);
  }

  .btn-function:hover {
    background: linear-gradient(to bottom right, #9333ea, #7e22ce);
  }

  .btn-function:focus {
    box-shadow: 0 0 0 3px #a855f7;
  }

  .dark .btn-function {
    background: linear-gradient(to bottom right, #9333ea, #7e22ce);
  }

  .dark .btn-function:hover {
    background: linear-gradient(to bottom right, #7e22ce, #6d28d9);
  }

  .dark .btn-function:focus {
    box-shadow: 0 0 0 3px #9333ea;
  }

  .btn-clear {
    background: linear-gradient(to bottom right, #ef4444, #dc2626);
    color: white;
    font-weight: 700;
    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
  }

  .btn-clear:hover {
    background: linear-gradient(to bottom right, #dc2626, #b91c1c);
  }

  .btn-clear:focus {
    box-shadow: 0 0 0 3px #ef4444;
  }

  .dark .btn-clear {
    background: linear-gradient(to bottom right, #dc2626, #b91c1c);
  }

  .dark .btn-clear:hover {
    background: linear-gradient(to bottom right, #b91c1c, #991b1b);
  }

  .dark .btn-clear:focus {
    box-shadow: 0 0 0 3px #dc2626;
  }

  .btn-equals {
    background: linear-gradient(to bottom right, #22c55e, #059669);
    color: white;
    font-weight: 700;
    font-size: 1.125rem;
    box-shadow: 0 10px 15px -3px rgba(34, 197, 94, 0.3);
  }

  .btn-equals:hover {
    background: linear-gradient(to bottom right, #059669, #047857);
  }

  .btn-equals:focus {
    box-shadow: 0 0 0 3px #22c55e;
  }

  .dark .btn-equals {
    background: linear-gradient(to bottom right, #059669, #047857);
  }

  .dark .btn-equals:hover {
    background: linear-gradient(to bottom right, #047857, #065f46);
  }

  .dark .btn-equals:focus {
    box-shadow: 0 0 0 3px #059669;
  }

  /* Transitions */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 200ms ease-in-out;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-right-enter-active,
  .slide-right-leave-active {
    transition: transform 300ms ease-in-out;
  }

  .slide-right-enter-from {
    transform: translateX(-100%);
  }

  .slide-right-leave-to {
    transform: translateX(-100%);
  }

  .list-enter-active,
  .list-leave-active {
    transition: all 300ms ease-in-out;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(1rem);
  }

  .list-move {
    transition: all 300ms ease-in-out;
  }

  /* Animations */
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-in-out;
  }

  /* Responsive */
  @media (max-width: 640px) {
    .btn {
      padding: 0.75rem 1rem;
      font-size: 0.875rem;
    }

    .display-main {
      padding: 1rem;
    }

    .calculator {
      padding: 1rem;
    }

    .history-panel {
      width: 16rem;
    }
  }
</style>
