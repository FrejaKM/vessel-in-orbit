<template>
  <div class="reflection-prompt">
    <div v-if="initialResponse" class="initial-response">
      <h4>A phrase for your phase</h4>
      <textarea v-model="userAnswer" placeholder="How do you feel today?"></textarea> 
      <button @click="generateQuote">{{ btnText }}</button>
    </div>
    <div v-if="motivationalQuote" class="motivational-quote" ref="quoteContainer" :style="{ backgroundImage: `url(${backgroundImage})` }">
      <div class="quote-text">
        <p>{{ motivationalQuote }}</p>
      </div>
    </div>
    <div v-if="motivationalQuote" class="download-button">
      <button @click="downloadQuote">Download PNG</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import html2canvas from 'html2canvas';
import backgroundImage from '/assets/background16.jpg'; // Import the background image

const BTN_TEXT = 'Submit';
const btnText = ref(BTN_TEXT);

const props = defineProps({
  initialResponse: String,
});

const question = "How do you feel today?";
const userAnswer = ref('');
const motivationalQuote = ref('');

const generateQuote = async () => {
  btnText.value = 'Generating...';
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: `Generate a saying that reflects the user's input. The saying should be down-to-earth, practical, and similar in tone to traditional expressions or folk wisdom, rather than abstract or overly inspirational. Aim for simple, relatable language — something that feels like common wisdom or advice. Don't mention Freja's name. Just provide the expression. Always start and end with "` },
        { role: 'user', content: userAnswer.value },
      ],
    }),
  });

  const { choices } = await response.json();
  motivationalQuote.value = choices[0]?.message?.content || "No quote generated.";
  btnText.value = BTN_TEXT; // Reset the button text after the response is received
};

const quoteContainer = ref(null);

const downloadQuote = async () => {
  if (quoteContainer.value) {
    const canvas = await html2canvas(quoteContainer.value);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'motivational-quote.png';
    link.click();
  }
};
</script>

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

.reflection-prompt {
  display: grid;
  text-align: right;
  font-size: 1rem;
  background-color: #ffffff;
  padding-top: 1.5rem;
  padding-bottom: 1rem;
}

textarea {
  width: 100%;
  height: auto;
  padding: 10px;
  border-radius: 4px;
  text-align: right;
  margin-bottom: 1.5rem;
  font-family: "Manrope", sans-serif;
  font-size: 1rem; /* Adjust the font size as needed */
  color: #000000; /* Text color */
  background-color: #ffffff; /* Background color */
  border: 1.5px solid black;
  resize: none;
}

h4{
  font-size: 1.2rem;
  font-weight: 500;
}

textarea::placeholder {
  color: #686868; /* Customize the placeholder text color */
}

button {
  padding: 10px 20px;
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  border-radius: 4px;
  cursor: pointer;
  border: 1.5px solid black;
  margin-bottom: 1.5rem;;
}

button:hover {
  background-color: #f1f0f0;
}

.motivational-quote {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 600px; /* Adjust the height as needed for vertical format */
  padding: 2rem;
  text-align: left;
  background-size: cover;
  background-position: center;
  position: relative;
}

.quote-text {
  position: absolute;
  font-family: 'Manrope', sans-serif;
  top: 60%;
  left: 60%;
  transform: translate(-50%, -50%);
  color: #000000; /* Text color to contrast with the background */
}

.download-button {
  padding-top: 1rem;
  text-align: right;
  margin-top: 1rem;
}
</style>