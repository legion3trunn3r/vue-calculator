<template>
  <div class="min-h-screen transition-colors duration-300" :class="isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'">
    <!-- Background decoration -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
      <div class="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      <div class="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
    </div>

    <!-- Main Content -->
    <div class="relative flex items-center justify-center min-h-screen p-4 z-10">
      <div class="w-full max-w-sm">
        <!-- Header with theme toggle -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-center flex-1" :class="isDark ? 'text-white' : 'text-gray-900'">
            🧮 Калькулятор
          </h1>
          <button
            @click="toggleTheme"
            class="ml-4 p-3 rounded-full transition-all duration-300 transform hover:scale-110"
            :class="isDark 
              ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
              : 'bg-blue-100 hover:bg-blue-200 text-blue-600'"
            :title="isDark ? 'Светлая тема' : 'Тёмная тема'"
          >
            {{ isDark ? '☀️' : '🌙' }}
          </button>
        </div>

        <!-- Calculator Card -->
        <div class="relative">
          <div class="absolute inset-0 rounded-3xl blur-2xl opacity-20" :class="isDark ? 'bg-blue-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'"></div>
          <div class="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 backdrop-blur-sm border border-white/10">
            <Calculator :isDark="isDark" />
          </div>
        </div>

        <!-- Footer info -->
        <div class="text-center mt-8 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          <p>💡 Используйте клавиатуру или сенсорные кнопки</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Calculator from '../components/Calculator.vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark')
}
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
