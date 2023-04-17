const {openai } =require('./gptAPI.js')

exports.createCompletion = async (req, res) => {
  const prompt=req.body.message
    try {
        const gptResponse = await openai.createCompletion({
          model: 'text-davinci-003',
          prompt: prompt,
          max_tokens: 200
        })
        if (gptResponse.data) {
          console.log('choices: ', gptResponse.data.choices)
          const outputText = gptResponse.data.choices[0].text.replace(/\n/g, "");
          return res.json({message:outputText})
        }
      } catch (err) {
        console.log(err)
      }
  };