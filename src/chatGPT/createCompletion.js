const {openai } =require('./gptAPI.js')

exports.createCompletion = async (prompt) => {
      const gptResponse = await openai.createCompletion({
          model: 'text-davinci-003',
          temperature:0.2,
          prompt: prompt,
          max_tokens: 3700,
          temperature: 0.5,
          frequency_penalty: 0.5,
          presence_penalty: 0.5,
          best_of: 1,
        })
        if (gptResponse?.data) {
          const outputText = gptResponse.data.choices[0].text.replace(/\n/g, "");
          return outputText
        }
        return gptResponse      
  };


