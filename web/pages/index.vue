<script setup lang="ts">
const localePath = useLocalePath()

useSeoMeta({
  title: 'Carman Wheel - Wheel Customization Preview Tool | Personalized Car Modification Solutions',
  keywords:
    'Carman Wheel, Carman Wheel APP, wheel customization, car modification, wheel preview, wheel design, car wheels, automotive personalization',
  description:
    'Carman Wheel is an innovative wheel customization preview tool that allows car enthusiasts to visualize and select personalized wheel designs for their vehicles.',
})
</script>

<template>
  <div
    class="bg-black sm:bg-[url('/images/background.webp')] sm:bg-[length:90%_auto] sm:bg-[position:160%_18%] 2xl:bg-[length:90%_auto] bg-no-repeat text-white max-w-full flex flex-col items-start justify-between min-h-screen"
  >
    <div class="mx-auto sm:px-6 lg:px-8 w-11/12 max-w-full sm:max-w-7xl box-border">
      <div class="max-w-full mx-auto h-24 flex items-center justify-center sm:justify-start">
        <div>
          <img src="/images/logo.png" alt="logo" class="block w-12 rounded-lg">
        </div>
        <div class="ml-3 font-bold text-2xl">Carman</div>
      </div>
      <NuxtLink
        :to="localePath('/blog')"
        class="text-primary-400 hover:underline mt-4 inline-block"
      >
        Blog
      </NuxtLink>
      <div
        class="flex flex-col items-center justify-start w-full sm:w-3/4 md:w-2/3 lg:w-1/2 sm:items-start mt-0 sm:mt-14"
      >
        <div class="text-left max-w-full">
          <h1
            class="text-3xl sm:text-6xl font-bold mb-4 leading-[3rem] sm:leading-[5.5rem] text-center sm:text-left"
          >
            Wheel Modification<br>Real-Time Preview
          </h1>
          <p class="text-xl opacity-60 mb-8 hidden sm:block leading-[1.65rem]">
            Featuring over 27 wheel brands and more than 400 wheel options to choose from. With real-time wheel
            modification previews, you can see the effect in advance and avoid regrets.
          </p>
          <div class="mx-auto sm:mx-0 w-[23rem] sm:w-[36rem] text-xs sm:text-base max-w-full">
            <div class="float-left mb-4 flex flex-row items-center w-1/2 pl-3 sm:pl-0">
              <img src="/images/check.svg" alt="icon1" class="w-4 sm:w-6">
              <span class="ml-2">Wheel Preview</span>
            </div>
            <div class="float-left mb-4 flex flex-row items-center w-1/2">
              <img src="/images/check.svg" alt="icon1" class="w-4 sm:w-6">
              <span class="ml-2">Caliper Preview</span>
            </div>
            <div class="float-left mb-4 flex flex-row items-center w-1/2 pl-3 sm:pl-0">
              <img src="/images/check.svg" alt="icon1" class="w-4 sm:w-6">
              <span class="ml-2">Lowered Preview</span>
            </div>
            <div class="float-left mb-4 flex flex-row items-center w-1/2">
              <img src="/images/check.svg" alt="icon1" class="w-4 sm:w-6">
              <span class="ml-2">Auto Magazine Generator</span>
            </div>
            <div class="clear-both" />
          </div>
        </div>
        <div class="flex flex-col justify-center mt-4 sm:mt-12 text-black w-11/12 sm:w-96 max-w-96">
          <a
            href="https://apk.carfrd.com/carman/carman-v1.1.18.apk?v=1118"
            target="_blank"
            rel="noopener noreferrer"
            class="h-14 sm:h-16 m-auto w-full bg-white flex flex-row items-center justify-between px-4 sm:px-5 rounded-md shadow-md hover:shadow-lg"
          >
            <div class="flex items-center justify-start">
              <img src="/images/Android.svg" alt="Android" class="w-7">
              <span class="ml-3 sm:ml-4 text-base sm:text-lg font-medium leading-5">Download for Android</span>
            </div>
            <img src="/images/arrow.svg" alt="arrow" class="w-2 sm:w-3">
          </a>
          <a
            href="https://apps.apple.com/us/app/carman-wheel/id6476076430"
            target="_blank"
            rel="noopener noreferrer"
            class="h-14 sm:h-16 m-auto w-full bg-white flex flex-row items-center justify-between px-4 sm:px-5 rounded-md shadow-md hover:shadow-lg mt-5"
          >
            <div class="flex items-center justify-start">
              <img src="/images/Apple.svg" alt="Apple" class="w-7">
              <span class="ml-3 sm:ml-4 text-base sm:text-lg font-medium leading-5">Download on the Apple Store</span>
            </div>
            <img src="/images/arrow.svg" alt="arrow" class="w-2 sm:w-3">
          </a>
        </div>
      </div>
    </div>
    <div
      class="block sm:hidden bg-[url('/images/background.webp')] bg-[length:200%_auto] bg-[position:75.5%_-3rem] w-full min-h-96 bg-no-repeat"
    >
      <div class="m-auto w-9/12 block sm:hidden mt-[73%] pt-5">
        <img src="/images/brand_wall.png" alt="" class="m-auto">
      </div>
    </div>
    <div class="sm:h-32 xl:h-60 mt-5 sm:mt-10 flex flex-col justify-between w-full">
      <div class="m-auto w-11/12 opacity-40 hidden sm:block">
        <img src="/images/wheel_logo.webp" alt="" class="m-auto">
      </div>
      <div class="m-auto w-full text-center text-xs text-gray-400 py-5 sm:py-0">
        2018-2024 © CARMAN WHEEL All Rights Reserved.
      </div>
    </div>
  </div>
</template>
