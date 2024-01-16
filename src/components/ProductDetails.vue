<template>

  <div class="flex justify-between">
    <p class="text-gray-400">SAMSUNG</p>
    <p class="text-green-600">Hurry Limited Stock</p>
  </div>
  <div class="border-b-2 border-gray-300 font-semibold *:mt-5 pb-5">
    <p class="text-2xl ">Samsung Galaxy S23 Plus 5G</p>
    <p class="text-xl">$880.00</p>
  </div>
  <div class="border-b-2 border-gray-300 *:mt-5 pb-5 ">
    <p><span class="font-bold">Sim:</span> DUAL SIM</p>
    <p><span class="font-bold">Condition:</span> LIKE NEW</p>
    <p><span class="font-bold">Colour:</span> LAVENDER</p>
    <p><span class="font-bold">Network:</span> UNBLOCKED</p>
    <p><span class="font-bold">Storage:</span> 512G</p>
  </div>
  <div class="flex p-5 font-bold w-min mx-auto sm:mx-0">
    <Qunatity/>
  </div>
  <button class="btn">Add to Basket</button>
</template>
<script>
import Qunatity from "@/components/Quantity.vue";

export default {
  name: 'ProductDetails',
  components: {Qunatity}
}
</script>