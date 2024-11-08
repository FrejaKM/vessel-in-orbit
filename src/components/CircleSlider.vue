<template>
  <div class="container">
    <div id="circle" @mousedown="startDrag">
      <div id="slider" :style="sliderStyle"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';

export default {
  name: 'CircleSlider',
  emits: ['update:angle'],
  setup(props, { emit }) {
    const angle = ref(0);
    const dragging = ref(false);
    const radius = 100; // Updated radius for 200x200 circle
    const thumbSize = 30; // Size of the thumb
    const sliderStyle = ref({
      left: `${radius * 2 - thumbSize / 2}px`, // Position at 0 degrees (rightmost point)
      top: `${radius - thumbSize / 2}px`,
    });

    const startDrag = () => {
      dragging.value = true;
    };

    const stopDrag = () => {
      dragging.value = false;
    };

    const onDrag = (event) => {
      if (!dragging.value) return;

      const circle = document.getElementById('circle').getBoundingClientRect();
      const centerX = circle.left + circle.width / 2;
      const centerY = circle.top + circle.height / 2;
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      const atan = Math.atan2(mouseX - centerX, mouseY - centerY);
      const deg = -atan / (Math.PI / 180) + 180;

      angle.value = Math.ceil(deg);
      emit('update:angle', angle.value);

      const x = Math.round(radius * Math.sin(deg * Math.PI / 180));
      const y = Math.round(radius * -Math.cos(deg * Math.PI / 180));

      sliderStyle.value = {
        left: `${x + radius - thumbSize / 2}px`,
        top: `${y + radius - thumbSize / 2}px`,
        transform: `rotate(${deg}deg)`,
      };
    };

    onMounted(() => {
      window.addEventListener('mousemove', onDrag);
      window.addEventListener('mouseup', stopDrag);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('mousemove', onDrag);
      window.removeEventListener('mouseup', stopDrag);
    });

    return {
      angle,
      sliderStyle,
      startDrag,
      stopDrag,
      onDrag,
    };
  },
};
</script>

<style scoped>

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: transparent;
}

#circle {
  width: 200px; /* Updated width */
  height: 200px; /* Updated height */
  border: 1.5px solid #000000;
  background: white;
  border-radius: 50%;
  position: relative;
}

#slider {
  width: 30px; /* Size of the thumb */
  height: 30px; /* Size of the thumb */
  background: #ffffff;
  border-radius: 50%;
  border: 1.5px solid #000000;
  position: absolute;
  top: 85px; /* Adjusted to center the thumb */
  left: 170px; /* Adjusted to start at 0 degrees */
  cursor: pointer;
  z-index: 1;
}

#slider:hover {
  background: #f1f0f0;
}
</style>