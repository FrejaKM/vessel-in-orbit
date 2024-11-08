<script>

</script>

<template>
  <h3>How's your energy today?</h3>
    <div class="slider">
        <div class="slider-track"></div>
        <input type="range" v-model="sliderValue" min="0" max="100" class="slider-thumb" />
    </div>
</template>

<style>

.h3 {
  display: flex;
}

.slider {
    width: 100%;
    display: flex;
    align-items: center;
    margin: 16px 0;
  }
  
  .slider-track {
    z-index: 1;
    position: absolute;
    height: 2px;
    width: 45%;
    background: #000000;
  }
  
  .slider-thumb {
    z-index: 2;
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    background: transparent;
    cursor: pointer;
  }
  
  
  .slider-thumb::-webkit-slider-thumb {
    z-index: 2;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #ffffff;
    border: 2px solid #000000;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .slider-thumb::-webkit-slider-thumb:hover {
    scale: 1.1;
    transition: scale 0.3s ease;
  }

</style>