<script setup>
  import ProductView from "@/components/ProductView.vue";
  import NavBar from "@/components/NavBar.vue";
  import ProductDetails from "@/components/ProductDetails.vue";
</script>

<template>
  <NavBar/>
  <div class="mx-auto max-w-5xl p-4 sm:p-10 flex flex-col sm:flex-row">
    <div class="w-full sm:w-1/2 mr-10 md:mr-24">
      <ProductView/>
    </div>
    <div class="w-full sm:w-1/2 text-gray-700">
      <ProductDetails/>
    </div>
  </div>
</template>
