const {openai } =require('./gptAPI.js')

exports.createCompletion = async (req, res) => {
  const prompt=req.body.message
    try {
        const gptResponse = await openai.createCompletion({
          model: 'text-curie-001',
          // 'text-davinci-003',
          temperature:0.2,
          prompt: prompt,
          max_tokens: 200
        })
        if (gptResponse.data) {
          console.log('choices: ', gptResponse)
          const outputText = gptResponse.data.choices[0].text.replace(/\n/g, "");
          return res.json({message:outputText})
        }
      } catch (err) {
        return res.staus(500).json('unknow error')
      }
  };