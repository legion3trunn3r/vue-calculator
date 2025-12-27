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
    position: fixed;
    left: 0;
    top: 0;
    width: 16rem;
    height: 100%;
    background: white;
    border-radius: 0 0.5rem 0.5rem 0;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    z-index: 50;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .dark .history-panel {
    background: #1f2937;
  }

  .history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .dark .history-header {
    border-bottom-color: #374151;
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
  }

  .history-item {
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
    cursor: pointer;
    transition: background-color 150ms ease-in-out;
  }

  .history-item:hover {
    background: #f3f4f6;
  }

  .dark .history-item {
    border-bottom-color: #374151;
  }

  .dark .history-item:hover {
    background: #374151;
  }

  .history-footer {
    border-top: 1px solid #e5e7eb;
    padding: 1rem;
  }

  .dark .history-footer {
    border-top-color: #374151;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 300ms ease-in-out;
  }

  .slide-enter-from {
    transform: translateX(-100%);
  }

  .slide-leave-to {
    transform: translateX(-100%);
  }
</style>
