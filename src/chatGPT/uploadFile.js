const {openai} = require('./gptAPI')
const fs = require ('fs')

async function uploadFile() {
  try {
    const response = await openai.createFile(
      fs.createReadStream('./data_prepared.jsonl'),
      'fine-tune'
    );
    return response.data.id

  } catch (err) {
    console.log('err: ', err)
  }
}
module.exports.fileId=uploadFile
