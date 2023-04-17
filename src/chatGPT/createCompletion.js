const {openai } =require('./gptAPI.js')

exports.createCompletion = async (req, res, next) => {
  const prompt=req.body.message
    try {
        const gptResponse = await openai.createCompletion({
          model: '',
          prompt: prompt,
          max_tokens: 200
        })
        if (gptResponse.data) {
          console.log('choices: ', gptResponse.data.choices)
          res.json(gptResponse.data.choices[0])
        }
      } catch (err) {
        err.message='system is busy plase try again later'
        next(err)
      }
  };