<script setup>
  import { ref } from "vue";
  const count = ref(1);
</script>
<template>
  <button class="text-2xl text-gray-500" @click="count = Math.max(count - 1, 1)">-</button>
  <div class="px-6 py-2 text-blue-500">{{ count }}</div>
  <button class="text-2xl text-gray-500" @click="count++">+</button>
</template>
