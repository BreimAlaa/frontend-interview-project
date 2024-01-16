<script setup>
  import { ref } from "vue";
  import Popup from "@/components/Popup.vue";

  const showPopup = ref(false);
  const closePopup = () => {
    showPopup.value = false;
  };
  const selectedSlide = ref(0);
  const images = [
    (new URL('../../src/assets/img.png', import.meta.url)),
    (new URL('../../src/assets/img_1.png', import.meta.url)),
    (new URL('../../src/assets/img_2.png', import.meta.url)),
  ];

  const zoomedImage = ref(null);
  const imageContainer = ref(null);
  const lens = ref(null);
  const zoom = (e) => {
    if (window.innerWidth < 640) return;

    const zoomFactor = 4;

    // show the zoom container and the lens
    zoomedImage.value.classList.remove("hidden");
    lens.value.classList.add("border-2");

    const { width: imageContainerWidth, height: imageContainerHeight } = imageContainer.value.getBoundingClientRect();
    // set the background image of the zoom container
    zoomedImage.value.style.backgroundImage = `url(${images[selectedSlide.value]})`;
    zoomedImage.value.style.backgroundSize = `${zoomFactor * imageContainerWidth}px ${zoomFactor * imageContainerHeight}px`;

    const { width: zoomedImageWidth, height: zoomedImageHeight } = zoomedImage.value.getBoundingClientRect();

    // set the width and height of the lens based on the zoom factor
    const lensWidth = (imageContainerWidth / (zoomFactor * imageContainerWidth)) * zoomedImageWidth;
    const lensHeight = (imageContainerHeight / (zoomFactor * imageContainerHeight)) * zoomedImageHeight;
    lens.value.style.width = `${ lensWidth }px`;
    lens.value.style.height = `${ lensHeight }px`;

    // get the offset of the mouse from the image container
    const offsetX = e.pageX - imageContainer.value.getBoundingClientRect().left;
    const offsetY = e.pageY - imageContainer.value.getBoundingClientRect().top;

    // calculate the background position of the zoom container
    let bgX = (offsetX - lensWidth / 2) / (imageContainerWidth - lensWidth) * 100;
    let bgY = (offsetY - lensHeight / 2) / (imageContainerHeight - lensHeight) * 100;

    // clamp the background position between 0 and 100
    bgX = Math.max(Math.min(bgX,100), 0);
    bgY = Math.max(Math.min(bgY,100), 0);

    zoomedImage.value.style.backgroundPosition = `${bgX}% ${bgY}%`;

    // calculate the position of the lens
    let lensX = (offsetX - lensWidth / 2) / imageContainerWidth;
    let lensY = (offsetY - lensHeight / 2) / imageContainerHeight;

    // insure the lens doesn't go outside the image container
    lensX = Math.max(lensX, 0);
    lensY = Math.max(lensY, 0);
    lensX = Math.min(((imageContainerWidth - (lensWidth)) / imageContainerWidth), lensX);
    lensY = Math.min(((imageContainerHeight - (lensHeight)) / imageContainerHeight), lensY);

    lens.value.style.left = `${(lensX * 100)}%`;
    lens.value.style.top = `${lensY * 100}%`;
  };
  const endZoom = () => {
    zoomedImage.value.style.backgroundImage = "";
    zoomedImage.value.classList.add("hidden");
    lens.value.classList.remove("border-2");
  };
</script>

<template>
  <Popup v-if="showPopup" :closePopup="closePopup" :selectedIndex="selectedSlide"/>
  <div ref="zoomedImage" class="hidden absolute z-10 right-1/2 bottom-1/2 translate-x-full translate-y-1/2 w-96 h-96">
  </div>
  <div class="relative overflow-hidden shadow-sm bg-white drop-shadow-md">
    <!-- Left Arrow -->
    <button class="absolute top-1/2 left-0 transform -translate-y-1/2"
            @click="selectedSlide = (selectedSlide - 1 + images.length) % images.length">
      <svg class="h-6 w-6 text-gray-500"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
           stroke-linejoin="round">
        <path d="M15 18l-6-6 6-6"></path>
      </svg>
    </button>

    <div class="flex justify-center sm:m-14 relative">

      <div class="relative"
      >
        <div class="absolute border-red-700"
             ref="lens"
             @click="showPopup = true"
             @mousemove="zoom"
             @mouseleave="endZoom"
        >
        </div>
        <img ref="imageContainer" class="object-cover max-h-80 -5"
             @click="showPopup = true"
             @mousemove="zoom"
             @mouseleave="endZoom"
             :src="images[selectedSlide]" alt="Samsung Galaxy S23 Plus 5G">
      </div>
    </div>

    <!-- Right Arrow -->
    <button class="absolute top-1/2 right-0 transform -translate-y-1/2"
            @click="selectedSlide = (selectedSlide + 1) % images.length">
      <svg class="h-6 w-6 text-gray-500"
           viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
           stroke-linejoin="round">
        <path d="M9 18l6-6-6-6"></path>
      </svg>
    </button>

    <div class="sm:flex hidden content-center justify-center gap-6 p-4 mt-5">
      <img v-for="(image, index) in images"
            :src="image"
           class="max-h-10 md:max-h-20 p-2 rounded"
           @click="selectedSlide = index"
           :class="{'border-2 border-blue-600': selectedSlide === index }"
      >
    </div>
  </div>
  <div class="flex content-center justify-center gap-2 p-4">
    <button class="h-2.5 w-2.5 rounded-full border" v-for="(image, index) in images"
            @click="selectedSlide = index"
            :class="selectedSlide === index ? 'border-red-500 bg-red-500' : 'border-gray-500'"
    ></button>

    <button class="text-gray-500 rounded-full">
      <svg class="h-2.5 w-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
    </button>
  </div>
</template>
