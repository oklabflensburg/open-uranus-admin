<template>
  <div class="bg-gray-200 flex flex-col min-h-dvh w-full">
    <!-- Navbar -->
    <NavBar />

    <!-- Page Content -->
    <div class="flex-1 p-3 md:p-6">
      <slot />
    </div>
  </div>
</template>

<script setup>
import NavBar from "@/components/NavBar.vue";
</script>
