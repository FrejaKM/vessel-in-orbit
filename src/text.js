const baseSystemPrompt = `
  You are an insightful assistant that helps the user, Freja, align with her "inner seasons" - phases in her cycle.
  Your role is to give tailored recommendations based on the user's current phase, sub-phase energy levels, and mood. Never mention sub-phases, only the phases.
  The phases are divided into winter, spring, summer, and fall, with early, mid, and late sub-phases.
  Respond in a supportive and nurturing tone, offering personalized self-care, productivity, and activity ideas. Here is some information about Freja: 
  She is 24 years old, she studies coded design full time on The Danish School of Media and Journalistm, she likes to winter bath and go to sauna, she likes to cook sometimes and she has a bunch of friends that she likes to spend time with. She also has a boyfriend that she lives with in Copenhagen, Vesterbro. He is her biggest supporter and where she can always find peace and feel safe. Freja also likes to talk to her mother about the problems in her life. Freja loves to get herself a little treat sometimes like a coffee or a snack. Freja is considering quitting her job at the cafe, but she fears that student loans will haunt her for the rest of her life. Freja likes to be at home and have a cozy time, but when she's in her spring and summer phase, she likes to be more social.

`;

const phasePrompts = {
  winter: {
    early: "Reflect and rest. Embrace slow activities that nurture inner warmth. Hormones are low",
    late: "Prepare for transition. Light physical activity and planning are supportive.",
  },
  spring: {
    early: "Ease into new projects and gentle exercise. Fresh starts are energizing. Estrogen starts to rise. Progeserone is low.",
    mid: "Build momentum. Focus on creativity and collaboration. Estrogen is rising and peaking soon. Progesterone is low.",
    late: "Embrace growth. Plan social activities and stretch your creative ideas. Estogen is almost peaking. Progesterone is low. Remind Freja not to make plans for the fall phase that she might regret later on.",
  },
  summer: {
    total: "Max energy! Engage fully in social events, intense exercise, and creative pursuits. Estrogen peaks.",
  },
  fall: {
    early: "Focus inward. Time for reflection and gentle winding down. Estrogen is falling. Progesterone is rising.",
    mid: "Start to slow down. Plan restorative activities, like journaling and meditation. estrogen has fallen. Progesterone is righ and rising.",
    late: "Prepare for rest. Prioritize sleep, low-impact exercise, and quiet time. Estrogen is low. Progesterone is at it's highest and will drop in the winter phase.",
  },
};

const generateSystemPrompt = (phase, subPhase) => {
  const phaseAdvice = phasePrompts[phase]?.[subPhase] || "Guidance for this phase is not defined.";
  return `${baseSystemPrompt} You are now guiding Freja through ${subPhase} ${phase}. ${phaseAdvice}. 

  
  SECTION 1: Say hello and provide a very brief overview of the current phase and Freja is in. Don't mention sub-phases.
  
  SECTION 2: Insights on hormone levels and their effects on energy levels, mood, relations, and productivity based on her phase and sub-phase. Don't mention sub-phases, only the inner phases.
  
  SECTION 3: A friendly reminder that aligns with her inner season. It could be a reminder to be patient with herself, to take a break, or to engage in activities that align with her current energy level and needs. Assume there is already a headline saying "a friendly reminder" and continue from there. Don't write the headline again always start with "that" or "to" in lower case.
  
  SECTION 4: Three activity or focus suggestions for the day, based on the phase and sub-phase. Suggestions should short, simple and aligned above each other and in one sentence each. No adjectives. Short and simple. No explanations, no introduction, no conclusion, no periods. If you suggest sauna, write "Take a trip to the sauna". If you suggest a walk, write "Go for a walk in the park". If you suggest a creative project, write "Start a creative project". Start each suggestion with a suiltable emoji instead of a number, bullet point or similar.`;
};

export async function getAdaptiveResponse(userMessage, phase, subPhase) {
  const systemPrompt = generateSystemPrompt(phase, subPhase);
  
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4', 
        messages: messages
      }),
    });

    const { choices } = await response.json();
    const fullResponse = choices[0]?.message?.content || "No response generated.";
    
    console.log(fullResponse);
    
    // Use regular expressions to capture the content of each section
    const section1Match = fullResponse.match(/SECTION 1:(.*?)(?=SECTION 2:|$)/s);
    const section2Match = fullResponse.match(/SECTION 2:(.*?)(?=SECTION 3:|$)/s);
    const section3Match = fullResponse.match(/SECTION 3:(.*?)(?=SECTION 4:|$)/s);
    const section4Match = fullResponse.match(/SECTION 4:(.*?)(?=$)/s);

    return {
      section1: section1Match ? section1Match[1].trim() : "No welcome provided.",
      section2: section2Match ? section2Match[1].trim() : "No insights provided.",
      section3: section3Match ? section3Match[1].trim() : "No reminder provided.",
      section4: section4Match ? section4Match[1].trim() : "No suggestions provided."
    };
  } catch (error) {
    console.error(error);
    return {
      section1: "An error occurred while generating the response.",
      section2: "An error occurred while generating the response.",
      section3: "An error occurred while generating the response.",
      section4: "An error occurred while generating the response."
    };
  }
}

export async function generateMotivationalQuote(initialResponse, userAnswer) {
  const systemPrompt = `Based on the following response: "${initialResponse}" and the user's answer: "${userAnswer}", generate a motivational quote.`;

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userAnswer }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_OPEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages
      }),
    });

    const { choices } = await response.json();
    return choices[0]?.message?.content || "No quote generated.";
  } catch (error) {
    console.error(error);
    return "An error occurred while generating the quote.";
  }
}

async function fetchSections(apiUrl, apiKey) {
  try {
    const prompt = `
    Please provide the following sections in your response:
    SECTION 1: Welcome message
    SECTION 2: Insights
    SECTION 3: Reminder
    SECTION 4: Suggestions
    `;

    // Send the prompt to the API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({ prompt })
    });

    const { choices } = await response.json();
    const fullResponse = choices[0]?.message?.content || "No response generated.";

    console.log(fullResponse);

    // Use regular expressions to capture the content of each section
    const section1Match = fullResponse.match(/SECTION 1:(.*?)(?=SECTION 2:|$)/s);
    const section2Match = fullResponse.match(/SECTION 2:(.*?)(?=SECTION 3:|$)/s);
    const section3Match = fullResponse.match(/SECTION 3:(.*?)(?=SECTION 4:|$)/s);
    const section4Match = fullResponse.match(/SECTION 4:(.*?)(?=$)/s);

    return {
      section1: section1Match ? section1Match[1].trim() : "No welcome provided.",
      section2: section2Match ? section2Match[1].trim() : "No insights provided.",
      section3: section3Match ? section3Match[1].trim() : "No reminder provided.",
      section4: section4Match ? section4Match[1].trim() : "No suggestions provided."
    };
  } catch (error) {
    console.error(error);
    return {
      section1: "An error occurred while generating the response.",
      section2: "An error occurred while generating the response.",
      section3: "An error occurred while generating the response.",
      section4: "An error occurred while generating the response."
    };
  }
}

