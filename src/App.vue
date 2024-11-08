<script setup>
import { ref } from 'vue';
import { getAdaptiveResponse } from './text';
import CircleSlider from './components/CircleSlider.vue';
import ReflectionPrompt from './components/ReflectionPrompt.vue';
import wheel2 from '/assets/wheel2.svg'; 

// Data properties
const angle = ref(0);
const phase = ref('');
const subPhase = ref('');
const BTN_TEXT = 'Submit';
const res = ref({
  section1: '',
  section2: '',
  section3: '',
  section4: '',
});
const btnText = ref(BTN_TEXT);
const initialResponse = ref('');
const hasResponse = ref(false); // Track if the response has been received

const phaseMapping = {
  winter: 'MENSTRUAL',
  spring: 'FOLLICULAR',
  summer: 'OVULATORY',
  fall: 'LUTEAL',
};

const updateAngle = (newAngle) => {
  angle.value = newAngle;
  [phase.value, subPhase.value] = translateAngleToPhase(newAngle);
};

const translateAngleToPhase = (angle) => {
  if (angle >= 0 && angle <= 30) {
    return ['winter', 'early'];
  } else if (angle >= 31 && angle <= 65) {
    return ['winter', 'late'];
  } else if (angle >= 66 && angle <= 100) {
    return ['spring', 'early'];
  } else if (angle >= 101 && angle <= 145) {
    return ['spring', 'mid'];
  } else if (angle >= 146 && angle <= 163) {
    return ['spring', 'late'];
  } else if (angle >= 164 && angle <= 190) {
    return ['summer', ''];
  } else if (angle >= 191 && angle <= 245) {
    return ['fall', 'early'];
  } else if (angle >= 246 && angle <= 305) {
    return ['fall', 'mid'];
  } else {
    return ['fall', 'late'];
  }
};

// Function to call the API
const askAi = async () => {
  btnText.value = 'Generating...';

  
  const response = await getAdaptiveResponse(`${phase.value} ${subPhase.value}`, phase.value, subPhase.value);
  res.value = response;
  initialResponse.value = `${res.value.section1} ${res.value.section2} ${res.value.section3} ${res.value.section4}`;

  btnText.value = BTN_TEXT;
  hasResponse.value = true; 
};
</script>

<template>
  <div class="center-wrapper">
    <div class="app-container">
      <h2>VESSEL IN ORBIT</h2>
      <h3>SLIDE TO YOUR CYCLE PHASE</h3>
      <div class="circle-slider-wrapper">
        <img :src="wheel2" alt="Wheel" class="wheel-svg" />
        <div class="circle-slider-container">
          <CircleSlider @update:angle="updateAngle" />
        </div>
        <p class="current-phase">{{ phaseMapping[phase] }}</p> 
      </div>
      <div class="button-block"> 
        <button type="button" @click="askAi" class="btn">
          {{ btnText }}
        </button>
      </div>
      
      <div v-if="hasResponse" id="box1" class="section-box">
        <pre>{{ res.section1 }}</pre> 
      </div>
      <div v-if="hasResponse" id="box2" class="section-box">
        <h4>Insights</h4>
        <pre>{{ res.section2 }}</pre> 
      </div>
      <div v-if="hasResponse" id="box3" class="section-box">
        <h4>A friendly reminder...</h4>
        <pre>{{ res.section3 }}</pre> 
      </div>
      <div v-if="hasResponse" id="box4" class="section-box">
        <h4> Today, it might be nice for you to...</h4>
        <pre>{{ res.section4 }}</pre> 
      </div>

      <ReflectionPrompt v-if="hasResponse" :initialResponse="initialResponse" id="refelction-prompt" class="section-box"/>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Gantari:wght@400;700&display=swap');

* {
  box-sizing: border-box;
  font-size: 1rem;
  font-family: "Manrope", sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}

.center-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow: auto; /* Add this line to make the container scrollable */
}

.app-container {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto;
  gap: 0px;
  max-width: 520px;
  width: 100%;
  padding: 2rem; 
  position: relative; 
}

.circle-slider-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}
.wheel-svg {
  width: 275px; 
  height: 275px; 
  z-index: 1; 
  user-select: none;
}

.circle-slider-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  z-index: 2; 
}

.current-phase {
  position: absolute;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 1rem;
  color: #000;
  z-index: 3; 
}

.button-block {
  display: flex;
  justify-content: center;
  grid-row-start: 4;
  grid-row-end: 5;
  padding-top: 1.5rem;
  padding-bottom: 3rem;
}

.btn {
  padding: 10px 20px;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  border-radius: 4px;
  cursor: pointer;
  border: 1.5px solid black;
  grid-row-start: 4;
  grid-row-end: 5;
}

button:hover {
  background-color: #f1f0f0;
}

h2 {
  font-size: 2rem;
  grid-row-start: 1;
  grid-row-end: 2;
  text-align: center;
  margin-bottom: 0px;
  margin-top: 0px;
  font-weight: 400;
}

h3 {
  font-size: 1rem;
  grid-row-start: 2;
  grid-row-end: 3;
  text-align: center;
}

h4 {
  font-size: 1.2rem;
  font-weight: 500;
}

.section-box {
  border-bottom: 1px solid #ccc;
  padding-top: 1.5rem;
  padding-bottom: 2.5rem;
}


#box1 {
  grid-row-start: 5;
  grid-row-end: 6;
  text-align: center;
  border-top: 1px solid #ccc;
  padding-bottom: 2rem;
}

#box2 {
  grid-row-start: 6;
  grid-row-end: 7;
  text-align: left;
}

#box3 {
  grid-row-start: 7;
  grid-row-end: 8;
  text-align: right;
}

#box4 {
  grid-row-start: 8;
  grid-row-end: 9;
  text-align: left;
}

#reflection-prompt {
  grid-row-start: 9;
  grid-row-end: 10;
  text-align: right;
}

pre {
  white-space: pre-wrap; /* Ensure long text wraps */
  word-wrap: break-word; /* Ensure long words break */
}
</style>
