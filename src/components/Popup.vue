<script setup>
import {onMounted, ref, watch} from "vue";

const {closePopup, selectedIndex} = defineProps({
  closePopup: {
    type: Function,
  },
  selectedIndex: {
    type: Number,
    default: 0,
  },
});

const images = [
  (new URL('../../src/assets/img.png', import.meta.url)),
  (new URL('../../src/assets/img_1.png', import.meta.url)),
  (new URL('../../src/assets/img_2.png', import.meta.url)),
];
const selectedSlide = ref(selectedIndex);
const imageContainer = ref(null);

let imageBgSize = {
  width: 0,
  height: 0,
};

const calculateBgSize = (width, height, container) => {

  const {width: containerWidth, height: containerHeight} = container.getBoundingClientRect();
  imageBgSize.width = (width / height > containerWidth / containerHeight) ?
      containerWidth :
      width * containerHeight / height;
  imageBgSize.height = (width / height > containerWidth / containerHeight) ?
      height * containerWidth / width :
      containerHeight;
};
const resetZoom = async () => {
  const img = new Image();
  img.src = images[selectedSlide.value];

  imageContainer.value.animate([
    {backgroundPosition: 'center'}
  ], {
    duration: 500,
    fill: "forwards",
    easing: "ease"
  });
  await img.decode();
  const {width, height} = img;
  calculateBgSize(width, height, imageContainer.value);
  imageContainer.value.style.backgroundSize = `${imageBgSize.width}px ${imageBgSize.height}px`;
};

onMounted(resetZoom);
watch(selectedSlide, resetZoom);

let clickCount = 0;
let timer;
const click = (e) => {
  clickCount++;
  if (clickCount === 2) {
    clearTimeout(timer);
    doubleClick(e);
    clickCount = 0;
    return;
  }
  timer = setTimeout(() => {
    zoom(e);
    console.log(clickCount);
    clickCount = 0;
  }, 300);

};

let isZoomed = false;

const doubleClick = (e) => {
  if (isZoomed) {
    zoom(e);
    return;
  }
  // zoom to the mouse position
  const {offsetX, offsetY} = e;
  const {width, height} = e.target.getBoundingClientRect();
  const x = offsetX / width;
  const y = offsetY / height;
  e.target.style.backgroundSize = `${imageBgSize.width * 2}px ${imageBgSize.height * 2}px`
  e.target.animate([
    {backgroundPosition: `${x * 100}% ${y * 100}%`},
  ], {
    duration: 1000,
    fill: "forwards",
    easing: "ease"
  });

  isZoomed = true;
};
const zoom = (e) => {
  if (isZoomed) {
    resetZoom();
    e.target.animate([
      {backgroundPosition: 'center'}
    ], {
      duration: 1000,
      fill: "forwards",
      easing: "ease"
    });
    e.target.style.cursor = 'zoom-in';
    isZoomed = false;
    return;
  }
  if (window.innerWidth < 640) return;
  e.target.style.cursor = 'zoom-out';
  e.target.style.backgroundSize = `${imageBgSize.width * 2}px ${imageBgSize.height * 2}px`
  isZoomed = true;
};

const moveImage = (e) => {
  if (!isZoomed) return;
  const {offsetX, offsetY} = e;
  const {width, height} = e.target.getBoundingClientRect();
  const x = offsetX / width;
  const y = offsetY / height;
  e.target.animate([
    {backgroundPosition: `${x * 100}% ${y * 100}%`}
  ], {
    duration: 1000,
    fill: "forwards",
    easing: "ease"
  });

};


let startX = 0;
let startY = 0;
const swipeStart = (e) => {
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
};
const swipeEnd = (e) => {
const endX = e.changedTouches[0].clientX;
  const endY = e.changedTouches[0].clientY;
  const diffX = endX - startX;
  const diffY = endY - startY;
  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) {
      selectedSlide.value = (selectedSlide.value - 1 + images.length) % images.length;
    } else {
      selectedSlide.value = (selectedSlide.value + 1) % images.length;
    }
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50">
    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div class="relative bg-white p-5 rounded-lg w-[90vw] h-[90vh] overflow-hidden flex flex-col">

        <button class="absolute top-4 right-4 text-gray-500"
                @click="closePopup()"
        >
          <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div class="flex gap-4 w-full items-start border-b-2 mb-2 pb-2">
          <button class="text-gray-500">
            <p>Images</p>
          </button>
          <button class="text-gray-800 border-b-2">
            <p>Videos</p>
          </button>
        </div>


        <div class="flex sm:flex-row flex-col sm:gap-10 gap-2 h-full">
          <div class="sm:w-2/3 overflow-hidden h-full">
           <div class="mx-auto bg-no-repeat w-full h-full relative bg-center cursor-zoom-in"
                ref="imageContainer"
                style="transition : background-size 0.5s ease"
                :style="{ backgroundImage: `url(${images[selectedSlide]})` }"
                @mousemove="moveImage"
                @click="click"
                @touchstart="swipeStart"
                @touchend="swipeEnd"
           >
          </div>
          </div>
          <div class="sm:w-1/3">
            <div class="hidden sm:block"><p class="text-xl">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus, accusantium adipisci alias
            </p>
              <p class="text-gray-400">
                Lorem ipsum dolor sit amet
              </p></div>
            <div class="flex gap-2 md:gap-6 mt-5 sm:flex-wrap max-sm:justify-center overflow-auto">
              <img v-for="(image, index) in images"
                   :src="image"
                   class="max-h-10 md:max-h-20 min-h-16 p-2 rounded"
                   @click="selectedSlide = index"
                   :class="{'border-2 border-blue-600': selectedSlide === index }"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>