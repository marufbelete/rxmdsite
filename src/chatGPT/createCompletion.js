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
        console.log(gptResponse?.status)
        console.log(gptResponse?.statusText)
        if (gptResponse?.status==429&&gptResponse?.statusText=='Too Many Requests') {
          console.log("wait some time")
          
          // await wait(90000); // Wait for 90 seconds
        } 
        if (gptResponse?.data) {
          // console.log('choices: ', gptResponse)
          const outputText = gptResponse.data.choices[0].text.replace(/\n/g, "");
          // console.log(outputText)
          return outputText
        }
        console.log(gptResponse)
        return gptResponse
      // let response = '';
      // // let cont ='';
      // while (!response.endsWith('END OF RESPONSE')) {
      //   const gptResponse = await openai.createCompletion({
      //     model: 'text-davinci-003',
      //     prompt: `${prompt}`,
      //     max_tokens: 3600, // Adjust the remaining tokens based on current response length
      //     temperature: 0.5,
      //     frequency_penalty: 0.5,
      //     presence_penalty: 0.5,
      //     best_of: 1,
      //     stop: 'END OF RESPONSE',
      //   });
      
      //   if (gptResponse?.data) {
      //     // console.log('choices:', gptResponse);
      //     console.log(gptResponse.data.choices[0])
      //     const outputText = gptResponse.data.choices[0].text.replace(/\n/g, '');
      //     console.log(outputText);
      //     response += outputText;
      //     // cont='continue from where you stop'
      //   }
      // }
      
      // console.log(response);
      // return response
      
  };


