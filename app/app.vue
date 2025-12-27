<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full">
      <h1 class="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Калькулятор
      </h1>
      <Calculator />
    </div>
  </div>
</template>

<script setup lang="ts">
import Calculator from '../components/Calculator.vue'
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
