<template>
  <Transition name="slide">
    <div v-if="isOpen" class="history-panel">
      <div class="history-header">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
          История вычислений
        </h3>
        <button
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
        >
          ✕
        </button>
      </div>

      <div class="history-list">
        <div
          v-if="historyItems.length === 0"
          class="text-center text-gray-500 dark:text-gray-400 py-8"
        >
          История пуста
        </div>

        <div
          v-for="(entry, index) in historyItems"
          :key="index"
          class="history-item"
          @click="$emit('select', entry.result)"
        >
          <div class="text-sm text-gray-600 dark:text-gray-400">
            {{ entry.expression }}
          </div>
          <div class="font-semibold text-gray-900 dark:text-white">
            = {{ entry.result }}
          </div>
          <div class="text-xs text-gray-400 mt-1">
            {{ formatTime(entry.timestamp) }}
          </div>
        </div>
      </div>

      <div class="history-footer">
        <button
          @click="$emit('clear')"
          class="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Очистить историю
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  import type { HistoryEntry } from '../composables/useCalculatorHistory'

  defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    historyItems: {
      type: Array as () => HistoryEntry[],
      required: true,
    },
  })

  defineEmits(['close', 'select', 'clear'])

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }
</script>

<style scoped>
  .history-panel {
    @apply fixed left-0 top-0 w-64 h-full bg-white dark:bg-gray-800 rounded-r-2xl shadow-2xl z-50 flex flex-col overflow-hidden;
  }

  .history-header {
    @apply flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700;
  }

  .history-list {
    @apply flex-1 overflow-y-auto;
  }

  .history-item {
    @apply p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150;
  }

  .history-footer {
    @apply border-t border-gray-200 dark:border-gray-700 p-4;
  }

  .slide-enter-active,
  .slide-leave-active {
    @apply transition-transform duration-300;
  }

  .slide-enter-from {
    @apply -translate-x-full;
  }

  .slide-leave-to {
    @apply -translate-x-full;
  }
</style>
