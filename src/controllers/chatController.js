const {createCompletion}=require('../chatGPT/createCompletion');

exports.chatCompletion = async (req, res, next) => {
    try {
    const prompt=req.body.message
    const response=await createCompletion(prompt)
    return res.json({message:response})
    }  
    catch (err) {
        console.log(err.response.data)
        return res.status(500).json('unknow error')
      }
  };
  