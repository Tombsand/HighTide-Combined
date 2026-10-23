<template>
  <RouterView />
  <Toaster class="fixed bottom-5 right-5 flex flex-col-reverse gap-3 w-1/3" />
</template>

<script setup>
import { Toaster } from 'vue-sonner';
</script>